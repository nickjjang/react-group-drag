import React from 'react';
import PropTypes from 'prop-types';
import * as SharedStyle from '../../shared-style';

const STYLE = {
  fontSize: '11px',
  color: SharedStyle.PRIMARY_COLOR.text_alt,
  padding: '5px 15px 8px 15px',
  backgroundColor: SharedStyle.PRIMARY_COLOR.alt,
  textShadow: '-1px -1px 2px rgba(0, 0, 0, 1)',
  boxShadow: 'inset 0px -3px 19px 0px rgba(0,0,0,0.5)',
  margin: '0px'
};

export default function ContentTitle({ children, style = {}, ...rest }) {
  return <h3 style={{ ...STYLE, ...style }} {...rest}>{children}</h3>;
}

ContentTitle.propsType = {
  style: PropTypes.object
};
