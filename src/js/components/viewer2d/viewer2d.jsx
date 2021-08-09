/* eslint-disable func-names */
/* eslint-disable react/require-default-props */
/* eslint-disable no-param-reassign */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable no-case-declarations */
/* eslint-disable default-case */


import React from 'react';
import PropTypes from 'prop-types';

import {
  ReactSVGPanZoom, TOOL_NONE, TOOL_PAN, TOOL_ZOOM_IN, TOOL_ZOOM_OUT, TOOL_AUTO
} from 'react-svg-pan-zoom';
import * as constants from '../../constants';
import State from './state';

function mode2Tool(mode) {
  switch (mode) {
    case constants.MODE_2D_PAN:
      return TOOL_PAN;
    case constants.MODE_2D_ZOOM_IN:
      return TOOL_ZOOM_IN;
    case constants.MODE_2D_ZOOM_OUT:
      return TOOL_ZOOM_OUT;
    case constants.MODE_IDLE:
      return TOOL_AUTO;
    default:
      return TOOL_NONE;
  }
}

function mode2PointerEvents(mode) {
  switch (mode) {
    case constants.MODE_DRAWING_LINE:
    case constants.MODE_DRAWING_HOLE:
    case constants.MODE_DRAWING_ITEM:
    case constants.MODE_DRAGGING_HOLE:
    case constants.MODE_DRAGGING_ITEM:
    case constants.MODE_RESIZING_ITEM:
    case constants.MODE_DRAGGING_LINE:
    case constants.MODE_DRAGGING_VERTEX:
      return { pointerEvents: 'none' };

    default:
      return {};
  }
}

function mode2Cursor(mode) {
  switch (mode) {
    case constants.MODE_DRAGGING_HOLE:
    case constants.MODE_DRAGGING_LINE:
    case constants.MODE_DRAGGING_VERTEX:
    case constants.MODE_DRAGGING_ITEM:
      return { cursor: 'move' };

    case constants.MODE_ROTATING_ITEM:
      return { cursor: 'ew-resize' };

    case constants.MODE_WAITING_DRAWING_LINE:
    case constants.MODE_DRAWING_LINE:
      return { cursor: 'crosshair' };
    default:
      return { cursor: 'default' };
  }
}

function mode2DetectAutopan(mode) {
  switch (mode) {
    case constants.MODE_DRAWING_LINE:
    case constants.MODE_DRAGGING_LINE:
    case constants.MODE_DRAGGING_VERTEX:
    case constants.MODE_DRAGGING_HOLE:
    case constants.MODE_DRAGGING_ITEM:
    case constants.MODE_RESIZING_ITEM:
    case constants.MODE_DRAWING_HOLE:
    case constants.MODE_DRAWING_ITEM:
      return true;

    default:
      return false;
  }
}

function extractElementData(node) {
  while (!node.attributes.getNamedItem('data-element-root') && node.tagName !== 'svg') {
    node = node.parentNode;
  }
  if (node.tagName === 'svg') return null;

  return {
    part: node.attributes.getNamedItem('data-part') ? node.attributes.getNamedItem('data-part').value : undefined,
    layer: node.attributes.getNamedItem('data-layer').value,
    prototype: node.attributes.getNamedItem('data-prototype').value,
    selected: node.attributes.getNamedItem('data-selected').value === 'true',
    id: node.attributes.getNamedItem('data-id').value
  };
}

export default function Viewer2D(
  {
    state, width, height, viewMode
  },
  {
    viewer2DActions, verticesActions, itemsActions, projectActions, catalog
  }
) {
  const {
    viewer2D, mode, scene
  } = state;
  const layerID = scene.selectedLayer;
  const mapCursorPosition = ({ x, y }) => ({ x, y: -y + scene.height });

  const onMouseMove = (viewerEvent) => {
    const evt = new Event('mousemove-planner-event');
    evt.viewerEvent = viewerEvent;
    document.dispatchEvent(evt);

    const { x, y } = mapCursorPosition(viewerEvent);

    projectActions.updateMouseCoord({ x, y });

    switch (mode) {
      case constants.MODE_DRAWING_ITEM:
        itemsActions.updateDrawingItem(layerID, x, y);
        break;
      case constants.MODE_DRAGGING_VERTEX:
        verticesActions.updateDraggingVertex(x, y, state.snapMask);
        break;

      case constants.MODE_DRAGGING_ITEM:
        itemsActions.updateDraggingItem(x, y);
        break;
      case constants.MODE_RESIZING_ITEM:
        itemsActions.updateResizingItem(x, y);
        break;

      case constants.MODE_ROTATING_ITEM:
        itemsActions.updateRotatingItem(x, y);
        break;
    }

    viewerEvent.originalEvent.stopPropagation();
  };

  const onMouseDown = (viewerEvent) => {
    const event = viewerEvent.originalEvent;

    // workaround that allow imageful component to work
    const evt = new Event('mousedown-planner-event');
    evt.viewerEvent = viewerEvent;
    document.dispatchEvent(evt);

    const { x, y } = mapCursorPosition(viewerEvent);

    if (mode === constants.MODE_IDLE) {
      const elementData = extractElementData(event.target);
      if (!elementData || !elementData.selected) return;

      switch (elementData.prototype) {
        case 'vertices':
          verticesActions.beginDraggingVertex(elementData.layer, elementData.id, x, y, state.snapMask);
          break;

        case 'items':
          if (elementData.part === 'rotation-anchor') {
            itemsActions.beginRotatingItem(elementData.layer, elementData.id, x, y);
          } else if (elementData.part === 'resize-anchor') {
            itemsActions.beginResizingItem(elementData.layer, elementData.id, x, y);
          } else {
            itemsActions.beginDraggingItem(elementData.layer, elementData.id, x, y);
          }
          break;
        default: break;
      }
    }
    event.stopPropagation();
  };

  const onMouseUp = (viewerEvent) => {
    const event = viewerEvent.originalEvent;
    const evt = new Event('mouseup-planner-event');
    evt.viewerEvent = viewerEvent;
    document.dispatchEvent(evt);

    const { x, y } = mapCursorPosition(viewerEvent);
    switch (mode) {
      case constants.MODE_IDLE:
        const elementData = extractElementData(event.target);

        if (elementData && elementData.selected) return;

        switch (elementData ? elementData.prototype : 'none') {
          case 'items':
            itemsActions.selectItem(elementData.layer, elementData.id);
            break;

          case 'none':
            projectActions.unselectAll();
            break;
        }
        break;

      case constants.MODE_DRAWING_ITEM:
        itemsActions.endDrawingItem(layerID, x, y);
        projectActions.rollback();
        projectActions.loadProject(JSON.parse(localStorage.getItem('react-floorplanner_v0')));
        break;
      case constants.MODE_DRAGGING_VERTEX:
        verticesActions.endDraggingVertex(x, y, state.snapMask);
        break;

      case constants.MODE_DRAGGING_ITEM:
        itemsActions.endDraggingItem(x, y);
        projectActions.loadProject(JSON.parse(localStorage.getItem('react-floorplanner_v0')));
        break;
      case constants.MODE_RESIZING_ITEM:
        itemsActions.endResizingItem(x, y);
        break;

      case constants.MODE_ROTATING_ITEM:
        itemsActions.endRotatingItem(x, y);
        break;
    }
    event.stopPropagation();
  };

  const onChangeValue = (value) => {
    projectActions.updateZoomScale(value.a);
    return viewer2DActions.updateCameraView(value);
  };

  const onChangeTool = (tool) => {
    switch (tool) {
      case TOOL_NONE:
        projectActions.selectToolEdit();
        break;

      case TOOL_PAN:
        viewer2DActions.selectToolPan();
        break;

      case TOOL_ZOOM_IN:
        viewer2DActions.selectToolZoomIn();
        break;

      case TOOL_ZOOM_OUT:
        viewer2DActions.selectToolZoomOut();
        break;
    }
  };

  return (
    <ReactSVGPanZoom
      width={width}
      height={height}
      value={viewer2D.isEmpty() ? null : viewer2D.toJS()}
      onChangeValue={onChangeValue}
      tool={mode2Tool(mode)}
      onChangeTool={onChangeTool}
      detectAutoPan={mode2DetectAutopan(mode)}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      miniaturePosition="none"
      className="planner-content"
      toolbarPosition="right">

      <svg width={scene.width} height={scene.height}>
        <g style={Object.assign(mode2Cursor(mode), mode2PointerEvents(mode))}>
          <State state={state} catalog={catalog} viewMode={viewMode} />
        </g>
      </svg>

    </ReactSVGPanZoom>
  );
}


Viewer2D.propTypes = {
  state: PropTypes.object.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired
};

Viewer2D.contextTypes = {
  viewer2DActions: PropTypes.object.isRequired,
  verticesActions: PropTypes.object.isRequired,
  itemsActions: PropTypes.object.isRequired,
  projectActions: PropTypes.object.isRequired,
  catalog: PropTypes.object.isRequired
};
