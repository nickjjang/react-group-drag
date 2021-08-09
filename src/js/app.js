

import React, { Component } from 'react';
import {
  Router, Switch, Route
} from 'react-router-dom';

import history from './history';
import Main from './scenes/Main';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initialized: false
    };
  }

  componentDidMount() {
    this.setState({
      initialized: true
    });
  }

  render() {
    const {
      initialized
    } = this.state;

    return (
      initialized ? (
        <Router history={history}>
          <Switch>
            <Route path="/" name="Main" component={Main} />
          </Switch>
        </Router>
      ) : null
    );
  }
}

export default App;
