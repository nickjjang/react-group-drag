/* eslint-disable prefer-rest-params */
import {
  PROJECT_ACTIONS,
  VIEWER2D_ACTIONS,
  ITEMS_ACTIONS,
  SCENE_ACTIONS,
  VERTEX_ACTIONS
} from '../constants';

import {
  ReactPlannerItemsReducer,
  ReactPlannerProjectReducer,
  ReactPlannerSceneReducer,
  ReactPlannerVerticesReducer,
  ReactPlannerViewer2dReducer
} from './export';

import { State } from '../models';

export const initialState = new State();

export default function appReducer(state, action) {
  if (PROJECT_ACTIONS[action.type]) return ReactPlannerProjectReducer(...arguments);
  if (VIEWER2D_ACTIONS[action.type]) return ReactPlannerViewer2dReducer(...arguments);
  if (ITEMS_ACTIONS[action.type]) return ReactPlannerItemsReducer(...arguments);
  if (SCENE_ACTIONS[action.type]) return ReactPlannerSceneReducer(...arguments);
  if (VERTEX_ACTIONS[action.type]) return ReactPlannerVerticesReducer(...arguments);

  return state || initialState;
}
