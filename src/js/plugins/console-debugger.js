/* eslint-disable no-param-reassign */
/* eslint-disable no-shadow */
import actions from '../actions/export';

export default function consoleDebugger() {
  return (store, stateExtractor) => {
    window.ReactPlanner = {
      ...actions,

      getStore() {
        return store;
      },

      getState() {
        return stateExtractor(store.getState());
      },

      do(actions, delay = 300) {
        actions = actions.reverse();
        const { dispatch } = store;
        const dispatchAction = () => {
          if (actions.length === 0) return;
          dispatch(actions.pop());
          if (actions.length === 0) return;
          setTimeout(dispatchAction, delay);
        };
        setTimeout(dispatchAction, 0);
      }
    };
  };
}
