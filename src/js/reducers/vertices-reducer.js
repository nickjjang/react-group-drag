/* eslint-disable no-use-before-define */
import { Map, List } from 'immutable';
import {
  BEGIN_DRAGGING_VERTEX,
  UPDATE_DRAGGING_VERTEX,
  END_DRAGGING_VERTEX,
  MODE_DRAGGING_VERTEX,
  MODE_IDLE
} from '../constants';
import { sceneSnapElements } from '../utils/snap-scene';
import { nearestSnap } from '../utils/snap';
import {
  detectAndUpdateAreas,
  removeLine,
  addLineAvoidingIntersections,
  mergeEqualsVertices
} from '../utils/layer-operations';
import { orderVertices, pointsDistance, samePoints } from '../utils/geometry';

export default function (state, action) {
  switch (action.type) {
    case BEGIN_DRAGGING_VERTEX:
      return beginDraggingVertex(state, action.layerID, action.vertexID, action.x, action.y);

    case UPDATE_DRAGGING_VERTEX:
      return updateDraggingVertex(state, action.x, action.y);

    case END_DRAGGING_VERTEX:
      return endDraggingVertex(state, action.x, action.y);

    default:
      return state;
  }
}

function beginDraggingVertex(state, layerID, vertexID, x, y) {
  const snapElements = sceneSnapElements(state.scene, new List(), state.snapMask);

  return state.merge({
    mode: MODE_DRAGGING_VERTEX,
    snapElements,
    draggingSupport: Map({
      layerID, vertexID
    })
  });
}

function updateDraggingVertex(state, x, y) {
  const { draggingSupport, snapElements, scene } = state;

  let snap = null;
  if (state.snapMask && !state.snapMask.isEmpty()) {
    snap = nearestSnap(snapElements, x, y, state.snapMask);
    if (snap) ({ x, y } = snap.point);
  }

  const layerID = draggingSupport.get('layerID');
  const vertexID = draggingSupport.get('vertexID');
  return state.merge({
    activeSnapElement: snap ? snap.snap : null,
    scene: scene.mergeIn(['layers', layerID, 'vertices', vertexID], { x, y })
  });
}

function endDraggingVertex(state, x, y) {
  const { catalog } = state;

  const { draggingSupport } = state;
  const layerID = draggingSupport.get('layerID');
  const vertexID = draggingSupport.get('vertexID');
  const lineIDs = state.scene.layers.get(layerID).vertices.get(vertexID).lines;

  const scene = state.scene.updateIn(['layers', layerID], layer => layer.withMutations((layer) => {
    lineIDs.forEach((lineID) => {
      const line = layer.lines.get(lineID);

      if (line) {
        let oldVertexID;

        if (line.vertices.get(0) === vertexID) {
          // I need to invert vertices
          oldVertexID = line.vertices.get(1);
        } else {
          oldVertexID = line.vertices.get(0);
        }

        const oldVertex = layer.vertices.get(oldVertexID);
        const vertex = layer.vertices.get(vertexID);

        const oldHoles = [];

        const orderedVertices = orderVertices([oldVertex, vertex]);

        line.holes.forEach((holeID) => {
          const hole = layer.holes.get(holeID);
          const oldLineLength = pointsDistance(oldVertex.x, oldVertex.y, vertex.x, vertex.y);

          const alpha = Math.atan2(orderedVertices[1].y - orderedVertices[0].y,
            orderedVertices[1].x - orderedVertices[0].x);

          let { offset } = hole;

          if (orderedVertices[1].x === line.vertices.get(1).x
            && orderedVertices[1].y === line.vertices(1).y) {
            offset = 1 - offset;
          }

          const xp = oldLineLength * offset * Math.cos(alpha) + orderedVertices[0].x;
          const yp = oldLineLength * offset * Math.sin(alpha) + orderedVertices[0].y;

          oldHoles.push({ hole, offsetPosition: { x: xp, y: yp } });
        });

        mergeEqualsVertices(layer, vertexID);
        removeLine(layer, lineID);

        if (!samePoints(oldVertex, vertex)) {
          addLineAvoidingIntersections(layer, line.type,
            oldVertex.x, oldVertex.y,
            vertex.x, vertex.y,
            catalog,
            line.properties, oldHoles);
        }
      }
    });

    detectAndUpdateAreas(layer, catalog);
  }));

  return state.merge({
    mode: MODE_IDLE,
    draggingSupport: null,
    scene,

    activeSnapElement: null,
    snapElements: new List(),
    sceneHistory: state.sceneHistory.push(scene)
  });
}
