/* eslint-disable default-case */
/* eslint-disable react/require-default-props */
/* eslint-disable react/forbid-prop-types */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CatalogItem from './catalog-item';
import ContentContainer from '../style/content-container';
// import ContentTitle from '../style/content-title';

const containerStyle = {
  overflowY: 'auto',
  overflowX: 'hidden'
};

const itemsStyle = {
  padding: '0 1em',
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(7em, 2fr))',
  gridGap: '10px',
  marginTop: '1em',
  marginBottom: '1em',
  overflowY: 'auto'
};

const searchContainer = {
  width: '100%',
  padding: '0 1em',
  cursor: 'pointer',
  position: 'relative',
  boxShadow: '0 1px 6px 0 rgba(0, 0, 0, 0.11), 0 1px 4px 0 rgba(0, 0, 0, 0.11)',
  transition: 'all .2s ease-in-out',
  WebkitTransition: 'all .2s ease-in-out',
  marginTop: '1em'
};

const searchInput = {
  width: '100%',
  height: '2em',
  margin: '0',
  padding: '0 1em',
  border: '1px solid #EEE'
};

export default class CatalogList extends Component {
  constructor(props, context) {
    super(props);
    this.state = {
      matchString: '',
      matchedElements: []
    };
  }

  render() {
    const { page } = this.props.state.catalog;
    const currentCategory = this.context.catalog.getCategory(page);
    const elementsToDisplay = currentCategory.elements.filter(element => (element.info.visibility ? element.info.visibility.catalog : true));

    return (
      <ContentContainer width={this.props.width} height="auto" style={{ ...containerStyle, ...this.props.style }}>
        <div
          style={{ height: 40, width: '100%' }}
        />
        <div style={itemsStyle}>
          {
            this.state.matchString === '' ? [
              elementsToDisplay.map(elem => <CatalogItem key={elem.name} element={elem} />)
            ]
              : this.state.matchedElements.map(elem => <CatalogItem key={elem.name} element={elem} />)
          }
        </div>
      </ContentContainer>
    );
  }
}

CatalogList.propTypes = {
  state: PropTypes.object.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  style: PropTypes.object
};

CatalogList.contextTypes = {
  catalog: PropTypes.object.isRequired,
  translator: PropTypes.object.isRequired,
  itemsActions: PropTypes.object.isRequired,
  projectActions: PropTypes.object.isRequired
};
