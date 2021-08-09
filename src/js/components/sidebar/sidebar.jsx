/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable react/forbid-prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import * as SharedStyle from '../../shared-style';
import CatalogList from '../catalog-view/catalog-list';

const STYLE = {
  backgroundColor: SharedStyle.PRIMARY_COLOR.main,
  display: 'block',
  overflowY: 'auto',
  overflowX: 'hidden',
  paddingBottom: '20px'
};

export default function Sidebar({
  state, width, height
}) {
  return (
    <aside
      style={{ width, height, ...STYLE }}
      onKeyDown={event => event.stopPropagation()}
      onKeyUp={event => event.stopPropagation()}
      className="sidebar"
    >
      <div className="catalogs">
        <CatalogList state={state} width={width} height={height} />
      </div>
    </aside>
  );
}

Sidebar.propTypes = {
  state: PropTypes.object.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired
};
