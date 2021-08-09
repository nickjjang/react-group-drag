import React, {
  Component
} from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import ContainerDimensions from 'react-container-dimensions';
import MyCatalog from '../../demo/src/catalog/mycatalog';
import {
  ReactPlanner,
  Plugins as PlannerPlugins
} from '../../diagram';
import { DefaultJSON } from '../../config/data';
import { loadProject } from '../../actions/project-actions';

const plugins = [
  PlannerPlugins.Keyboard(),
  PlannerPlugins.Autosave('react-floorplanner_v0'),
  PlannerPlugins.ConsoleDebugger()
];

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      view: false
    };
  }

  componentDidMount() {
    if (!localStorage.getItem('react-floorplanner_v0')) {
      localStorage.setItem('react-floorplanner_v0', JSON.stringify(DefaultJSON));
    }
    this.props.load(JSON.parse(localStorage.getItem('react-floorplanner_v0')));
  }

  render() {
    const { view } = this.state;
    if (!view) {
      setTimeout(() => {
        this.setState({
          view: true
        });
      }, 1000);
    }
    return (
      <div style={{ height: '100vh' }}>
        {
          view && (
            <ContainerDimensions>
              <ReactPlanner
                editable
                viewMode={false}
                editMode
                catalog={MyCatalog}
                width={1600}
                height={1100}
                plugins={plugins}
                stateExtractor={state => state.get('react-floorplanner')}
              />
            </ContainerDimensions>
          )
        }
      </div>
    );
  }
}

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => ({
  load: bindActionCreators(loadProject, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);
