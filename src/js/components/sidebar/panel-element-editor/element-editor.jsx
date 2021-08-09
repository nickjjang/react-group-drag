/* eslint-disable react/forbid-prop-types */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Map, fromJS } from 'immutable';
import convert from 'convert-units';
import { Button } from 'reactstrap';
// import MdContentCopy from 'react-icons/lib/md/content-copy';
// import MdContentPaste from 'react-icons/lib/md/content-paste';
import diff from 'immutablediff';
// import FormSubmitButton from '../../style/form-submit-button';
// import CancelButton from '../../style/cancel-button';
// import DeleteButton from '../../style/delete-button';
import AttributesEditor from './attributes-editor/attributes-editor';
import * as geometry from '../../../utils/geometry.js';
import * as math from '../../../utils/math.js';
// import * as SharedStyle from '../../../shared-style';

const PRECISION = 2;

const attrPorpSeparatorStyle = {
  margin: '0.5em 0.25em 0.5em 0',
  // border: `2px solid ${SharedStyle.SECONDARY_COLOR.alt}`,
  position: 'relative',
  height: '2.5em',
  borderRadius: '2px'
};

const headActionStyle = {
  position: 'relative',
  right: '0.5em',
  top: '0.5em',
  display: 'flex'
};

const iconHeadStyle = {
  float: 'left',
  margin: '-3px 4px 0px 0px',
  padding: 0,
  cursor: 'pointer',
  fontSize: '1.4em'
};

export default class ElementEditor extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      attributesFormData: this.initAttrData(this.props.element, this.props.layer, this.props.state),
      propertiesFormData: this.initPropData(this.props.element, this.props.layer, this.props.state)
    };

    this.updateAttribute = this.updateAttribute.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { attributesFormData: oldAttribute, propertiesFormData: oldProperties } = this.state;
    const { attributesFormData: newAttribute, propertiesFormData: newProperties } = nextState;

    if (diff(oldAttribute, newAttribute).size) return true;
    if (diff(oldProperties, newProperties).size) return true;

    if (diff(this.props.state.clipboardProperties, nextProps.state.clipboardProperties).size) return true;

    return false;
  }

  componentWillReceiveProps({ element, layer, state }) {
    const { prototype, id } = element;
    const scene = this.props.state.get('scene');
    const selectedLayer = scene.getIn(['layers', scene.get('selectedLayer')]);
    const selected = selectedLayer.getIn([prototype, id]);

    if (diff(selectedLayer, layer).size) {
      this.setState({
        attributesFormData: this.initAttrData(element, layer, state),
        propertiesFormData: this.initPropData(element, layer, state)
      });
    }
  }

  initAttrData(element, layer, state) {
    element = typeof element.misc === 'object' ? element.set('misc', new Map(element.misc)) : element;

    switch (element.prototype) {
      case 'items': {
        return new Map(element);
      }
      case 'areas': {
        return new Map({});
      }
      default:
        return null;
    }
  }

  initPropData(element, layer, state) {
    const { catalog } = this.context;
    const catalogElement = catalog.getElement(element.type);

    const mapped = {};
    for (const name in catalogElement.properties) {
      mapped[name] = new Map({
        currentValue: element.properties.has(name) ? element.properties.get(name) : fromJS(catalogElement.properties[name].defaultValue),
        configs: catalogElement.properties[name]
      });
    }

    return new Map(mapped);
  }

  updateAttribute(attributeName, value) {
    let { attributesFormData } = this.state;

    switch (this.props.element.prototype) {
      case 'items': {
        attributesFormData = attributesFormData.set(attributeName, value);
        break;
      }
      default:
        break;
    }

    this.setState({ attributesFormData });
    this.save({ attributesFormData });
  }

  updateProperty(propertyName, value) {
    let { state: { propertiesFormData } } = this;
    propertiesFormData = propertiesFormData.setIn([propertyName, 'currentValue'], value);
    this.setState({ propertiesFormData });
    this.save({ propertiesFormData });
  }

  reset() {
    this.setState({ propertiesFormData: this.initPropData(this.props.element, this.props.layer, this.props.state) });
  }

  save({ propertiesFormData, attributesFormData }) {
    if (propertiesFormData) {
      const properties = propertiesFormData.map(data => data.get('currentValue'));

      this.context.projectActions.setProperties(properties);
    }

    if (attributesFormData) {
      switch (this.props.element.prototype) {
        case 'items': {
          this.context.projectActions.setItemsAttributes(attributesFormData);
          break;
        }
        default:
          break;
      }
    }
  }

  copyProperties(element) {
    if (element.type.includes('table')) {
      this.context.projectActions.copyProperties(element.properties);
    }
  }

  pasteProperties(element) {
    if (element.type.includes('table')) {
      this.context.itemsActions.selectToolDrawingItem(element.type);
      this.context.projectActions.pasteProperties();
    }
  }

  render() {
    const {
      state: { propertiesFormData, attributesFormData },
      context: { catalog, translator },
      props: { state: appState, element }
    } = this;

    return (
      <div>

        <AttributesEditor
          element={element}
          onUpdate={this.updateAttribute}
          attributeFormData={attributesFormData}
          state={appState}
        />

        {propertiesFormData.entrySeq()
          .map(([propertyName, data]) => {
            const currentValue = data.get('currentValue'); const
              configs = data.get('configs');

            const { Editor } = catalog.getPropertyType(configs.type);

            return (
              <Editor
                key={propertyName}
                propertyName={propertyName}
                value={currentValue}
                configs={configs}
                onUpdate={value => this.updateProperty(propertyName, value)}
                state={appState}
                sourceElement={element}
                internalState={this.state}
            />
            );
          })
        }
        {
          element.type.includes('table') && (
            <div style={attrPorpSeparatorStyle}>
              <div style={headActionStyle}>
                <div title={translator.t('Copy')} style={iconHeadStyle} onClick={e => this.copyProperties(element)}>
                  <Button type="button" color="primary" style={{ marginLeft: 90 }}>copy</Button>
                </div>
                { appState.get('clipboardProperties') ? (
                  <div title={translator.t('Paste')} style={iconHeadStyle} onClick={e => this.pasteProperties(element)}>
                    <Button type="button" color="primary">paste</Button>
                  </div>
                ) : null }
              </div>
            </div>
          )
        }
      </div>
    );
  }
}

ElementEditor.propTypes = {
  state: PropTypes.object.isRequired,
  element: PropTypes.object.isRequired,
  layer: PropTypes.object.isRequired
};

ElementEditor.contextTypes = {
  itemsActions: PropTypes.object.isRequired,
  projectActions: PropTypes.object.isRequired,
  catalog: PropTypes.object.isRequired,
  translator: PropTypes.object.isRequired
};
