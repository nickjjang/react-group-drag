/* eslint-disable react/require-default-props */
/* eslint-disable react/forbid-prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import Layer from './layer';

export default function Scene({
  scene, catalog, viewMode
}) {
  const { layers } = scene;
  const selectedLayer = scene.layers.get(scene.selectedLayer);

  return (
    <g>
      <g style={{ pointerEvents: 'none' }}>
        {layers.entrySeq()
          .filter(([layerID, layer]) => layerID !== scene.selectedLayer && layer.visible)
          .map(([layerID, layer]) => <Layer key={layerID} layer={layer} scene={scene} catalog={catalog} viewMode={viewMode} />)}
      </g>
      {
        selectedLayer && <Layer key={selectedLayer.id} layer={selectedLayer} scene={scene} catalog={catalog} viewMode={viewMode} />
      }
    </g>
  );
}


Scene.propTypes = {
  scene: PropTypes.object.isRequired,
  catalog: PropTypes.object.isRequired
};
