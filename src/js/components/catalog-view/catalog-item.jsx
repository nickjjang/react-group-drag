/* eslint-disable react/forbid-prop-types */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable default-case */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import IconAdd from 'react-icons/lib/fa/plus-circle';
import * as SharedStyle from '../../shared-style';

const STYLE_BOX = {
  width: '6.5em',
  height: '6.5em',
  padding: '0.325em',
  background: '#f7f7f9',
  border: '1px solid #e1e1e8',
  cursor: 'pointer',
  position: 'relative',
  boxShadow: '0 1px 6px 0 rgba(0, 0, 0, 0.11), 0 1px 4px 0 rgba(0, 0, 0, 0.11)',
  borderRadius: '2px',
  transition: 'all .15s ease-in-out',
  WebkitTransition: 'all .15s ease-in-out',
  alignSelf: 'center',
  justifySelf: 'center'
};

const STYLE_BOX_HOVER = {
  ...STYLE_BOX,
  background: SharedStyle.SECONDARY_COLOR.main
};

const STYLE_TITLE = {
  width: '100%',
  textAlign: 'center',
  display: 'block',
  marginBottom: '.5em',
  textTransform: 'capitalize',
  fontSize: '0.75em'
};

const STYLE_TITLE_HOVER = {
  ...STYLE_TITLE,
  color: SharedStyle.COLORS.white
};

const STYLE_IMAGE_CONTAINER = {
  width: '100%',
  height: '4em',
  position: 'relative',
  overflow: 'hidden',
  border: 'solid 1px #e6e6e6',
  padding: 0,
  margin: 0,
  marginBottom: '5px'
};

const STYLE_IMAGE = {
  position: 'absolute',
  background: '#222',
  width: '100%',
  height: '100%',
  backgroundSize: 'contain',
  backgroundPosition: '50% 50%',
  backgroundColor: SharedStyle.COLORS.white,
  backgroundRepeat: 'no-repeat',
  transition: 'all .2s ease-in-out'
};

const STYLE_IMAGE_HOVER = {
  ...STYLE_IMAGE,
  transform: 'scale(1.2)'
};

const STYLE_PLUS_HOVER = {
  marginTop: '1.5em',
  color: SharedStyle.SECONDARY_COLOR.main,
  fontSize: '1em',
  opacity: '0.7',
  width: '100%'
};

export default class CatalogItem extends Component {
  constructor(props) {
    super(props);
    this.state = { hover: false };
  }

  select() {
    const { element } = this.props;

    switch (element.prototype) {
      case 'items':
        this.context.itemsActions.selectToolDrawingItem(element.name);
        break;
    }

    this.context.projectActions.pushLastSelectedCatalogElementToHistory(element);
  }

  render() {
    const { element } = this.props;
    const { hover } = this.state;

    return (
      <div
        style={hover ? STYLE_BOX_HOVER : STYLE_BOX}
        onClick={e => this.select()}
        onMouseEnter={e => this.setState({ hover: true })}
        onMouseLeave={e => this.setState({ hover: false })}
      >
        <b style={!hover ? STYLE_TITLE : STYLE_TITLE_HOVER}>
          {element.info.title}
        </b>
        <div style={STYLE_IMAGE_CONTAINER}>
          <div style={{ ...(!hover ? STYLE_IMAGE : STYLE_IMAGE_HOVER), backgroundImage: `url(${element.info.image})` }}>
            { hover ? <IconAdd style={STYLE_PLUS_HOVER} /> : null }
          </div>
        </div>
      </div>
    );
  }
}

CatalogItem.propTypes = {
  element: PropTypes.object.isRequired
};

CatalogItem.contextTypes = {
  itemsActions: PropTypes.object.isRequired,
  projectActions: PropTypes.object.isRequired
};
