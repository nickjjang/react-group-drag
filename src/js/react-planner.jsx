/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/require-default-props */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Translator from './translator/translator';
import Catalog from './catalog/catalog';
import actions from './actions/export';
import { objectsMap } from './utils/objects-utils';
import {
  Content,
  SidebarComponents
} from './components/export';

const { Sidebar } = SidebarComponents;

const sidebarW = 150;

const wrapperStyle = {
  display: 'flex',
  flexFlow: 'row nowrap'
};

class ReactPlanner extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  getChildContext() {
    return {
      ...objectsMap(actions, actionNamespace => this.props[actionNamespace]),
      translator: this.props.translator,
      catalog: this.props.catalog
    };
  }

  componentWillMount() {
    const { store } = this.context;
    const {
      projectActions, catalog, stateExtractor, plugins
    } = this.props;

    plugins.forEach((plugin) => {
      plugin(store, stateExtractor);
    });
    projectActions.initCatalog(catalog);
  }

  componentWillReceiveProps(nextProps) {
    const {
      stateExtractor, state, projectActions, catalog
    } = nextProps;
    const plannerState = stateExtractor(state);

    const catalogReady = plannerState.getIn(['catalog', 'ready']);
    if (!catalogReady) {
      projectActions.initCatalog(catalog);
    }
  }

  render() {
    const {
      width, height, state, stateExtractor, viewMode, projectActions,
      editable, editMode, ...props
    } = this.props;
    const contentW = width - sidebarW;
    const sidebarH = height;

    const extractedState = stateExtractor(state);

    return (
      <div style={{ ...wrapperStyle, height }} id="react_floorplanner">
        <Sidebar viewMode={viewMode} width={sidebarW} height={sidebarH} state={extractedState} {...props} />
        <Content
          width={contentW}
          height={height}
          viewMode={viewMode}
          editable={editable}
          state={extractedState}
          {...props}
          onWheel={event => event.preventDefault()}
        />
      </div>
    );
  }
}

ReactPlanner.propTypes = {
  translator: PropTypes.instanceOf(Translator),
  catalog: PropTypes.instanceOf(Catalog),
  allowProjectFileSupport: PropTypes.bool,
  plugins: PropTypes.arrayOf(PropTypes.func),
  autosaveKey: PropTypes.string,
  autosaveDelay: PropTypes.number,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  stateExtractor: PropTypes.func.isRequired,
  sidebarComponents: PropTypes.array,
  customContents: PropTypes.object,
  softwareSignature: PropTypes.string
};

ReactPlanner.contextTypes = {
  store: PropTypes.object.isRequired
};

ReactPlanner.childContextTypes = {
  ...objectsMap(actions, () => PropTypes.object),
  translator: PropTypes.object,
  catalog: PropTypes.object
};

ReactPlanner.defaultProps = {
  translator: new Translator(),
  catalog: new Catalog(),
  plugins: [],
  allowProjectFileSupport: true,
  softwareSignature: 'restaurant-floorplanner 1.0',
  sidebarComponents: [],
  customContents: {}
};

// redux connect
function mapStateToProps(reduxState) {
  return {
    state: reduxState
  };
}

function mapDispatchToProps(dispatch) {
  return objectsMap(actions, actionNamespace => bindActionCreators(actions[actionNamespace], dispatch));
}

export default connect(mapStateToProps, mapDispatchToProps)(ReactPlanner);
