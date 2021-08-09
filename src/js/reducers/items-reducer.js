/* eslint-disable no-param-reassign */
import { Map } from 'immutable';

import {
  SELECT_TOOL_DRAWING_ITEM,
  UPDATE_DRAWING_ITEM,
  UPDATE_RESIZING_ITEM,
  END_DRAWING_ITEM,
  END_RESIZING_ITEM,
  BEGIN_DRAGGING_ITEM,
  BEGIN_RESIZING_ITEM,
  UPDATE_DRAGGING_ITEM,
  END_DRAGGING_ITEM,
  BEGIN_ROTATING_ITEM,
  UPDATE_ROTATING_ITEM,
  END_ROTATING_ITEM,
  SELECT_ITEM,

  MODE_IDLE,
  MODE_DRAWING_ITEM,
  MODE_DRAGGING_ITEM,
  MODE_RESIZING_ITEM,
  MODE_ROTATING_ITEM
} from '../constants';

import { addItem, select, unselectAll } from '../utils/layer-operations';

export default function (state, action) {
  switch (action.type) {
    case SELECT_ITEM:
      return selectItem(state, action.layerID, action.itemID);

    case SELECT_TOOL_DRAWING_ITEM:
      return selectToolDrawingItem(state, action.sceneComponentType);

    case UPDATE_DRAWING_ITEM:
      return updateDrawingItem(state, action.layerID, action.x, action.y);

    case END_DRAWING_ITEM:
      return endDrawingItem(state, action.layerID, action.x, action.y);

    case BEGIN_DRAGGING_ITEM:
      return beginDraggingItem(state, action.layerID, action.itemID, action.x, action.y);

    case BEGIN_RESIZING_ITEM:
      return beginResizingItem(state, action.layerID, action.itemID, action.x, action.y);

    case UPDATE_DRAGGING_ITEM:
      return updateDraggingItem(state, action.x, action.y);

    case UPDATE_RESIZING_ITEM:
      return updateResizingItem(state, action.x, action.y);

    case END_DRAGGING_ITEM:
      return endDraggingItem(state, action.x, action.y);

    case END_RESIZING_ITEM:
      return endResizingItem(state, action.x, action.y);

    case BEGIN_ROTATING_ITEM:
      return beginRotatingItem(state, action.layerID, action.itemID, action.x, action.y);

    case UPDATE_ROTATING_ITEM:
      return updateRotatingItem(state, action.x, action.y);

    case END_ROTATING_ITEM:
      return endRotatingItem(state, action.x, action.y);

    default:
      return state;
  }
}

function selectToolDrawingItem(state, sceneComponentType) {
  return state.merge({
    mode: MODE_DRAWING_ITEM,
    drawingSupport: Map({
      type: sceneComponentType
    })
  });
}

/** holes operations * */
function updateDrawingItem(state, layerID, x, y) {
  let { drawingSupport, catalog } = state;
  const scene = state.scene.updateIn(['layers', layerID], layer => layer.withMutations((layer) => {
    if (drawingSupport.has('currentID')) {
      layer.updateIn(['items', drawingSupport.get('currentID')], item => item.merge({ x, y }));
    } else {
      const { item } = addItem(layer, drawingSupport.get('type'), x, y, 200, 100, 0, catalog);
      select(layer, 'items', item.id);
      drawingSupport = drawingSupport.set('currentID', item.id);
    }
  }));

  return state.merge({
    scene,
    drawingSupport
  });
}

function endDrawingItem(state, layerID, x, y) {
  const { catalog } = state;
  state = updateDrawingItem(state, layerID, x, y, catalog);
  const scene = state.scene.updateIn(['layers', layerID], layer => unselectAll(layer));
  const item = state.getIn(['scene', 'layers', layerID, 'items', state.drawingSupport.get('currentID')]);
  const json = JSON.stringify(scene.toJS());
  localStorage.setItem('react-floorplanner_v0', json);
  const planner = JSON.parse(localStorage.getItem('react-floorplanner_v0'));
  const { items } = planner && planner.layers && planner.layers.layer_1;
  if (item.type === 'node-b') {
    Object.entries(items).map(([tableID, table]) => {
      if (table.type === 'node-a' && table.x - 250 < item.x - 200 && item.y + 200 < table.y + 250 && table.x + 250 > item.x + 200 && item.y - 200 > table.y - 250) {
        if (!table.children.includes(item.id)) {
          table.children.push(item.id);
        }
      } else if (table.children.includes(item.id)) {
        table.children = table.children.filter(filter => filter !== item.id);
      }
    });
  }
  if (item.type === 'node-c') {
    Object.entries(items).map(([tableID, table]) => {
      if (table.type === 'node-b' && table.x - 200 < item.x - 50 && item.y + 50 < table.y + 200 && table.x + 200 > item.x + 50 && item.y - 50 > table.y - 200) {
        if (!table.children.includes(item.id)) {
          table.children.push(item.id);
        }
      } else if (table.children.includes(item.id)) {
        table.children = table.children.filter(filter => filter !== item.id);
      }
    });
  }
  planner.layers.layer_1.items = items;
  localStorage.setItem('react-floorplanner_v0', JSON.stringify(planner));
  return state.merge({
    scene,
    sceneHistory: state.sceneHistory.push(scene),
    drawingSupport: Map({
      type: state.drawingSupport.get('type')
    })
  });
}

function beginResizingItem(state, layerID, itemID, x, y) {
  const item = state.getIn(['scene', 'layers', layerID, 'items', itemID]);
  return state.merge({
    mode: MODE_RESIZING_ITEM,
    resizingSupport: Map({
      layerID,
      itemID,
      startPointX: x,
      startPointY: y,
      originalX: item.x,
      originalY: item.y,
      originalWidth: item.properties.get('width').get('length'),
      originalHeight: item.properties.get('depth').get('length')
    })
  });
}

function beginDraggingItem(state, layerID, itemID, x, y) {
  const item = state.getIn(['scene', 'layers', layerID, 'items', itemID]);

  return state.merge({
    mode: MODE_DRAGGING_ITEM,
    draggingSupport: Map({
      layerID,
      itemID,
      startPointX: x,
      startPointY: y,
      originalX: item.x,
      originalY: item.y
    })
  });
}

function updateResizingItem(state, x, y) {
  const { resizingSupport, scene } = state;
  const layerID = resizingSupport.get('layerID');
  const itemID = resizingSupport.get('itemID');
  const startPointX = resizingSupport.get('startPointX');
  const startPointY = resizingSupport.get('startPointY');
  const originalX = resizingSupport.get('originalX');
  const originalY = resizingSupport.get('originalY');
  const originalWidth = resizingSupport.get('originalWidth');
  const originalHeight = resizingSupport.get('originalHeight');
  const diffX = x - startPointX;
  const diffY = y - startPointY;
  let item = scene.getIn(['layers', layerID, 'items', itemID]);
  const originWidth = item.properties.get('width').get('length');
  const originHeight = item.properties.get('depth').get('length');
  let Width = originalWidth;
  let Height = originalHeight;
  let X = originalX;
  let Y = originalY;
  if (startPointX - originalX >= -5 && startPointX - originalX <= 5) {
    if (startPointY - originalY > 0) {
      Y += diffY / 2;
      Height += diffY;
    } else {
      Y += diffY / 2;
      Height -= diffY;
    }
  } else if (startPointX - originalX > 0) {
    X += diffX / 2;
    Width += diffX;
  } else {
    X += diffX / 2;
    Width -= diffX;
  }

  if (Width < 60) {
    Width = originWidth;
  }

  if (Height < 50) {
    Height = originHeight;
  }

  item = item.merge({
    x: X,
    y: Y,
    properties: {
      width: {
        length: Width
      },
      depth: {
        length: Height
      }
    }
  });
  return state.merge({
    scene: scene.mergeIn(['layers', layerID, 'items', itemID], item)
  });
}

function updateDraggingItem(state, x, y) {
  const { draggingSupport, scene } = state;

  const layerID = draggingSupport.get('layerID');
  const itemID = draggingSupport.get('itemID');
  const startPointX = draggingSupport.get('startPointX');
  const startPointY = draggingSupport.get('startPointY');
  const originalX = draggingSupport.get('originalX');
  const originalY = draggingSupport.get('originalY');

  const diffX = startPointX - x;
  const diffY = startPointY - y;
  let item = scene.getIn(['layers', layerID, 'items', itemID]);
  item = item.merge({
    x: originalX - diffX,
    y: originalY - diffY
  });
  const json = JSON.stringify(scene.toJS());
  localStorage.setItem('react-floorplanner_v0', json);
  const planner = JSON.parse(localStorage.getItem('react-floorplanner_v0'));
  const { items } = planner && planner.layers && planner.layers.layer_1;
  if (item.children.length > 0) {
    for (let i = 0; i < item.children.length; i++) {
      const child = state.scene.getIn(['layers', layerID, 'items', item.children[i]]);
      Object.entries(items).map(([tableID, table]) => {
        if (tableID === child.id) {
          table.x -= diffX;
          table.y -= diffY;
          if (table.children.length > 0) {
            for (let j = 0; j < table.children.length; j++) {
              const subchild = state.scene.getIn(['layers', layerID, 'items', table.children[j]]);
              Object.entries(items).map(([id, cub]) => {
                if (id === subchild.id) {
                  cub.x -= diffX;
                  cub.y -= diffY;
                }
              });
            }
          }
        }
      });
    }
  }
  if (item.type === 'node-b') {
    Object.entries(items).map(([tableID, table]) => {
      if (table.type === 'node-a' && table.x - 250 < item.x - 200 && item.y + 200 < table.y + 250 && table.x + 250 > item.x + 200 && item.y - 200 > table.y - 250) {
        if (!table.children.includes(item.id)) {
          table.children.push(item.id);
        }
      } else if (table.children.includes(item.id)) {
        table.children = table.children.filter(filter => filter !== item.id);
      }
    });
  }
  if (item.type === 'node-c') {
    Object.entries(items).map(([tableID, table]) => {
      if (table.type === 'node-b' && table.x - 200 < item.x - 50 && item.y + 50 < table.y + 200 && table.x + 200 > item.x + 50 && item.y - 50 > table.y - 200) {
        if (!table.children.includes(item.id)) {
          table.children.push(item.id);
        }
      } else if (table.children.includes(item.id)) {
        table.children = table.children.filter(filter => filter !== item.id);
      }
    });
  }
  planner.layers.layer_1.items = items;
  localStorage.setItem('react-floorplanner_v0', JSON.stringify(planner));
  return state.merge({
    scene: scene.mergeIn(['layers', layerID, 'items', itemID], item),
    sceneHistory: state.sceneHistory.push(scene)
  });
}

function endDraggingItem(state, x, y) {
  state = updateDraggingItem(state, x, y);
  return state.merge({
    mode: MODE_IDLE,
    sceneHistory: state.sceneHistory.push(state.scene)
  });
}

function endResizingItem(state, x, y) {
  state = updateResizingItem(state, x, y);
  return state.merge({
    mode: MODE_IDLE,
    sceneHistory: state.sceneHistory.push(state.scene)
  });
}

function beginRotatingItem(state, layerID, itemID, x, y) {
  const item = state.getIn(['scene', 'layers', layerID, 'items', itemID]);

  return state.merge({
    mode: MODE_ROTATING_ITEM,
    rotatingSupport: Map({
      layerID,
      itemID
    })
  });
}

function updateRotatingItem(state, x, y) {
  const { rotatingSupport, scene } = state;

  const layerID = rotatingSupport.get('layerID');
  const itemID = rotatingSupport.get('itemID');
  let item = state.getIn(['scene', 'layers', layerID, 'items', itemID]);

  const deltaX = x - item.x;
  const deltaY = y - item.y;
  let rotation = Math.atan2(deltaY, deltaX) * 180 / Math.PI - 90;

  if (rotation > -5 && rotation < 5) rotation = 0;
  if (rotation > -95 && rotation < -85) rotation = -90;
  if (rotation > -185 && rotation < -175) rotation = -180;
  if (rotation > 85 && rotation < 90) rotation = 90;
  if (rotation > -270 && rotation < -265) rotation = 90;

  item = item.merge({
    rotation
  });

  return state.merge({
    scene: scene.mergeIn(['layers', layerID, 'items', itemID], item)
  });
}

function endRotatingItem(state, x, y) {
  state = updateRotatingItem(state, x, y);
  return state.merge({
    mode: MODE_IDLE,
    sceneHistory: state.sceneHistory.push(state.scene)
  });
}

function selectItem(state, layerID, itemID) {
  let { scene } = state;

  scene = scene.merge({
    layers: scene.layers.map(unselectAll),
    selectedLayer: layerID
  });

  scene = scene.updateIn(['layers', layerID], layer => layer.withMutations((layer) => {
    select(layer, 'items', itemID);
  }));

  return state.merge({
    scene,
    sceneHistory: state.sceneHistory.push(scene)
  });
}
