/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/forbid-prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import FormNumberInput from '../../../style/form-number-input';
import FormTextInput from '../../../style/form-text-input';

const tableStyle = {
  width: '100%'
};
const firstTdStyle = {
  width: '6em'
};
const inputStyle = {
  textAlign: 'left'
};

export default function ItemAttributesEditor({
  element, onUpdate, attributeFormData, state, ...rest
}, { translator, projectActions }) {
  const seats = attributeFormData.has('seats') ? attributeFormData.get('seats') : element.seats;
  const number = attributeFormData.has('number') ? attributeFormData.get('number') : element.number;
  const name = attributeFormData.has('name') ? attributeFormData.get('name') : element.name;
  const renderedX = attributeFormData.has('x') ? attributeFormData.get('x') : element.x;
  const renderedY = attributeFormData.has('y') ? attributeFormData.get('y') : element.y;
  const renderedR = attributeFormData.has('rotation') ? attributeFormData.get('rotation') : element.rotation;
  return (
    <table style={tableStyle}>
      <tbody>
        {
          element.type.includes('table') && (
            <tr>
              <td style={firstTdStyle}>
                Seats
              </td>
              <td>
                <FormNumberInput
                  value={seats}
                  onChange={event => onUpdate('seats', event.target.value)}
                  style={inputStyle}
                  state={state}
                  configs={{ precision: 0 }}
                  {...rest}
                />
              </td>
            </tr>
          )
        }
        {
          element.type.includes('table') && (
            <tr>
              <td style={firstTdStyle}>number</td>
              <td>
                <FormTextInput
                  value={number}
                  onChange={event => onUpdate('number', event.target.value)}
                  style={inputStyle}
                  state={state}
                />
              </td>
              <td style={{ width: 16, cursor: 'pointer' }}>
                <i className="fa fa-trash mx-2" onClick={() => projectActions.remove()} />
              </td>
            </tr>
          )
        }
        {/* <tr>
          <td style={firstTdStyle}>{translator.t('Capacity')}</td>
          <td>
            <FormTextInput
              value={name}
              onChange={event => onUpdate('name', event.target.value)}
              style={inputStyle}
            />
          </td>
        </tr> */}
        {/* <tr>
          <td style={firstTdStyle}>X</td>
          <td>
            <FormNumberInput
              value={renderedX}
              onChange={event => onUpdate('x', event.target.value)}
              style={inputStyle}
              state={state}
              configs={{ precision: 2 }}
              {...rest}
        />
          </td>
        </tr>
        <tr>
          <td style={firstTdStyle}>Y</td>
          <td>
            <FormNumberInput
              value={renderedY}
              onChange={event => onUpdate('y', event.target.value)}
              style={inputStyle}
              state={state}
              configs={{ precision: 2 }}
              {...rest}
        />
          </td>
        </tr>
        <tr>
          <td style={firstTdStyle}>{translator.t('Rotation')}</td>
          <td>
            <FormNumberInput
              value={renderedR}
              onChange={event => onUpdate('rotation', event.target.value)}
              style={inputStyle}
              state={state}
              configs={{ precision: 2 }}
              {...rest}
            />
          </td>
        </tr> */}
      </tbody>
    </table>
  );
}

ItemAttributesEditor.propTypes = {
  element: PropTypes.object.isRequired,
  onUpdate: PropTypes.func.isRequired,
  attributeFormData: PropTypes.object.isRequired,
  state: PropTypes.object.isRequired
};

ItemAttributesEditor.contextTypes = {
  translator: PropTypes.object.isRequired,
  projectActions: PropTypes.object.isRequired
};
