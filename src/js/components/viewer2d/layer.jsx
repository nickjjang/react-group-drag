/* eslint-disable react/require-default-props */
/* eslint-disable react/forbid-prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import Vertex from './vertex';
import Item from './item';

export default function Layer({
  layer, scene, catalog, viewMode
}) {
  const {
    vertices, items, opacity
  } = layer;

  return (
    <g opacity={opacity}>
      {items.entrySeq().map(([itemID, item]) => (
        item.type === 'node-a' && (
          <Item
            key={itemID}
            layer={layer}
            item={item}
            scene={scene}
            catalog={catalog}
            viewMode={viewMode}
          />
        )
      ))}
      {items.entrySeq().map(([itemID, item]) => (
        item.type === 'node-b' && (
          <Item
            key={itemID}
            layer={layer}
            item={item}
            scene={scene}
            catalog={catalog}
            viewMode={viewMode}
          />
        )
      ))}
      {items.entrySeq().map(([itemID, item]) => (
        item.type === 'node-c' && (
          <Item
            key={itemID}
            layer={layer}
            item={item}
            scene={scene}
            catalog={catalog}
            viewMode={viewMode}
          />
        )
      ))}
      {vertices.entrySeq()
        .filter(([vertex]) => vertex.selected)
        .map(([vertexID, vertex]) => <Vertex key={vertexID} layer={layer} vertex={vertex} />)}
    </g>
  );
}

Layer.propTypes = {
  layer: PropTypes.object.isRequired,
  scene: PropTypes.object.isRequired,
  catalog: PropTypes.object.isRequired
};
