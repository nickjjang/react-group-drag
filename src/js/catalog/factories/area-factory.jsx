import React from 'react';

export default function AreaFactory(name, info, textures) {
  const areaElement = {
    name,
    prototype: 'areas',
    info: {
      ...info,
      visibility: {
        catalog: false,
        layerElementsVisible: false
      }
    },
    properties: {
      patternColor: {
        label: 'color',
        type: 'color',
        defaultValue: '#f5f4f4'
      },
      thickness: {
        label: 'thickness',
        type: 'length-measure',
        defaultValue: {
          length: 0
        }
      }
    },
    render2D(element, layer, scene) {
      let path = '';

      // /print area path
      element.vertices.forEach((vertexID, ind) => {
        const vertex = layer.vertices.get(vertexID);
        path += `${(ind ? 'L' : 'M') + vertex.x} ${vertex.y} `;
      });

      // add holes
      element.holes.forEach((areaID) => {
        const area = layer.areas.get(areaID);

        area.vertices.reverse().forEach((vertexID, ind) => {
          const vertex = layer.vertices.get(vertexID);
          path += `${(ind ? 'L' : 'M') + vertex.x} ${vertex.y} `;
        });
      });

      const fill = element.selected ? '#99c3fb' : element.properties.get('patternColor');

      return (<path d={path} fill={fill} />);
    }

  };

  if (textures && textures !== {}) {
    const textureValues = {
      none: 'None'
    };

    for (const textureName in textures) {
      textureValues[textureName] = textures[textureName].name;
    }

    areaElement.properties.texture = {
      label: 'floor',
      type: 'enum',
      defaultValue: 'none',
      values: textureValues
    };
  }

  return areaElement;
}
