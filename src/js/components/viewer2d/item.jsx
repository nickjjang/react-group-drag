/* eslint-disable react/no-unused-state */
/* eslint-disable react/require-default-props */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */
/* eslint-disable react/forbid-prop-types */
import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import If from '../../utils/react-if';

class Item extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hover: false
    };
  }

  render() {
    const {
      layer, scene, item, catalog
    } = this.props;
    const {
      x, y, rotation
    } = item;

    const renderedItem = catalog.getElement(item.type).render2D(item, layer, scene);
    return (
      <Fragment>
        <g
          data-element-root
          data-prototype={item.prototype}
          data-id={item.id}
          data-selected={item.selected}
          data-layer={layer.id}
          style={item.selected ? { cursor: 'move' } : {}}
          transform={`translate(${x},${y}) rotate(${rotation})`}
          onMouseEnter={e => this.setState({ hover: true })}
          onMouseLeave={e => this.setState({ hover: false })}
        >
          {renderedItem}
          <If condition={item.selected}>
            <g
              data-element-root
              data-prototype={item.prototype}
              data-id={item.id}
              data-selected={item.selected}
              data-layer={layer.id}
              data-part="rotation-anchor"
            />
          </If>
        </g>
      </Fragment>
    );
  }
}

Item.propTypes = {
  item: PropTypes.object.isRequired,
  layer: PropTypes.object.isRequired,
  scene: PropTypes.object.isRequired,
  catalog: PropTypes.object.isRequired
};

Item.contextTypes = {
  projectActions: PropTypes.object.isRequired,
  catalog: PropTypes.object.isRequired
};

export default Item;
