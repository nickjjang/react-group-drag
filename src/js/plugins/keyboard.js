/* eslint-disable default-case */
import {
  MODE_IDLE, MODE_SNAPPING
} from '../constants';
import {
  rollback, undo, remove, toggleSnap
} from '../actions/project-actions';

const KEY_DELETE = 46;
const KEY_BACKSPACE = 8;
const KEY_ESC = 27;
const KEY_Z = 90;
const KEY_ALT = 18;

export default function keyboard(status) {
  return (store, stateExtractor) => {
    if (!status) {
      window.addEventListener('keydown', (event) => {
        // const state = stateExtractor(store.getState());
        // const mode = state.get('mode');

        // switch (event.keyCode) {
        //   case KEY_BACKSPACE:
        //   case KEY_DELETE:
        //   {
        //     if ([MODE_IDLE].includes(mode)) store.dispatch(remove());
        //     break;
        //   }
        //   case KEY_ESC:
        //   {
        //     store.dispatch(rollback());
        //     break;
        //   }
        //   case KEY_Z:
        //   {
        //     if (event.getModifierState('Control') || event.getModifierState('Meta')) store.dispatch(undo());
        //     break;
        //   }
        //   case KEY_ALT:
        //   {
        //     if (MODE_SNAPPING.includes(mode)) {
        //       store.dispatch(toggleSnap(state.snapMask.merge({
        //         SNAP_POINT: false, SNAP_LINE: false, SNAP_SEGMENT: false, tempSnapConfiguartion: state.snapMask.toJS()
        //       })));
        //     }
        //     break;
        //   }
        // }
      });

      window.addEventListener('keyup', (event) => {
        // const state = stateExtractor(store.getState());
        // const mode = state.get('mode');

        // switch (event.keyCode) {
        //   case KEY_ALT:
        //   {
        //     if (MODE_SNAPPING.includes(mode)) store.dispatch(toggleSnap(state.snapMask.merge(state.snapMask.get('tempSnapConfiguartion'))));
        //     break;
        //   }
        // }
      });
    }
  };
}
