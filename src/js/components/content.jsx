/* eslint-disable no-prototype-builtins */
/* eslint-disable react/forbid-prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import Viewer2D from './viewer2d/viewer2d';
import CatalogList from './catalog-view/catalog-list';
import ProjectConfigurator from './configurator/project-configurator';

import * as constants from '../constants';

export default function Content({
  width, height, state, customContents, viewMode, editable
}) {
  const mode = state.get('mode');
  switch (mode) {
    case constants.MODE_VIEWING_CATALOG:
      return <CatalogList state={state} width={width} height={height} />;

    case constants.MODE_IDLE:
    case constants.MODE_2D_ZOOM_IN:
    case constants.MODE_2D_ZOOM_OUT:
    case constants.MODE_2D_PAN:
    case constants.MODE_WAITING_DRAWING_LINE:
    case constants.MODE_DRAGGING_LINE:
    case constants.MODE_DRAGGING_VERTEX:
    case constants.MODE_DRAGGING_ITEM:
    case constants.MODE_RESIZING_ITEM:
    case constants.MODE_DRAWING_LINE:
    case constants.MODE_DRAWING_HOLE:
    case constants.MODE_DRAWING_ITEM:
    case constants.MODE_DRAGGING_HOLE:
    case constants.MODE_ROTATING_ITEM:
      return <Viewer2D viewMode={viewMode} state={state} editable={editable} width={width} height={height} />;

    case constants.MODE_CONFIGURING_PROJECT:
      return <ProjectConfigurator width={width} height={height} state={state} />;

    default:
      if (customContents.hasOwnProperty(mode)) {
        const CustomContent = customContents[mode];
        return <CustomContent width={width} height={height} state={state} />;
      }
      throw new Error(`Mode ${mode} doesn't have a mapped content`);
  }
}

Content.propTypes = {
  state: PropTypes.object.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired
};
