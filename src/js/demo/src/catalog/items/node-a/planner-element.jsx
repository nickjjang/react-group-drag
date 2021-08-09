import React from 'react';

export default {
  name: 'node-a',
  prototype: 'items',

  info: {
    tag: ['furnishings', 'wood'],
    group: 'items',
    title: 'Node A',
    description: 'Node A',
    image: ''
  },

  properties: {
    width: {
      label: 'width',
      type: 'length-measure',
      defaultValue: {
        length: 500,
        unit: 'cm'
      }
    },
    depth: {
      label: 'height',
      type: 'length-measure',
      defaultValue: {
        length: 500,
        unit: 'cm'
      }
    }
  },

  render2D(element) {
    const WIDTH = element.properties.get('width') ? element.properties.get('width').get('length') : 100;
    const DEPTH = element.properties.get('depth') ? element.properties.get('depth').get('length') : 100;
    const angle = element.rotation + 90;

    let textRotation = 0;
    if (Math.sin(angle * Math.PI / 180) < 0) {
      textRotation = 180;
    }
    return (

      <g transform={`translate(${-WIDTH / 2},${-DEPTH / 2})`}>
        <rect
          key="1"
          x="0"
          y="0"
          width={WIDTH}
          height={DEPTH}
          style={{ stroke: element.selected ? '#0096fd' : '#000', strokeWidth: '2px', fill: element.booked ? '#616264' : '#F5F5F5' }} />
        <text
          key="2"
          x="0"
          y="-220"
          transform={`translate(${WIDTH / 2}, ${DEPTH / 2}) scale(1,-1) rotate(${textRotation})`}
          style={{ textAnchor: 'middle', fontSize: '17px', fill: 'black' }}>
          Node A
        </text>
      </g>
    );
  }
};
