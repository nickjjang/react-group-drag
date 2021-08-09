/* eslint-disable no-param-reassign */
import { routerMiddleware } from 'react-router-redux';
import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { Map } from 'immutable';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';

// import reducers from './reducers';
import history from './history';
import fetchInterceptor from './interceptors/fetch';

import {
  Models as PlannerModels,
  reducer as PlannerReducer
} from './diagram';

const AppState = Map({
  'react-floorplanner': new PlannerModels.State()
});

const reducer = (state, action) => {
  state = state || AppState;
  state = state.update('react-floorplanner', plannerState => PlannerReducer(plannerState, action));
  return state;
};


const historyRouterMiddleware = routerMiddleware(history);

const getMiddleware = () => {
  if (process.env.NODE_ENV === 'production') {
    return applyMiddleware(historyRouterMiddleware, thunkMiddleware);
  }
  return applyMiddleware(historyRouterMiddleware, thunkMiddleware);
};

export const store = createStore(
  reducer,
  composeWithDevTools(
    fetchInterceptor(),
    getMiddleware()
  )
);

export default store;
