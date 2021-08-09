/* eslint-disable no-param-reassign */
/* eslint-disable no-prototype-builtins */
import { loadProject } from '../actions/project-actions';

const localStorage = window.hasOwnProperty('localStorage') ? window.localStorage : false;

const TIMEOUT_DELAY = 50;

let timeout = null;

export default function autosave(autosaveKey, delay) {
  return (store, stateExtractor) => {
    delay = delay || TIMEOUT_DELAY;

    if (!autosaveKey) return;
    if (!localStorage) return;
    // revert

    // if (localStorage.getItem('planner_status')) {
    //   const data = localStorage.getItem('react-floorplanner_v0');
    //   const json = JSON.parse(data);
    //   store.dispatch(loadProject(json));
    //   localStorage.setItem('planner_status', false);
    // } else if (localStorage.getItem(autosaveKey) !== null) {
    //   const data = localStorage.getItem(autosaveKey);
    //   const json = JSON.parse(data);
    //   store.dispatch(loadProject(json));
    // }

    // // update

    // store.subscribe(() => {
    //   if (timeout) clearTimeout(timeout);
    //   timeout = setTimeout(() => {
    //     const state = stateExtractor(store.getState());
    //     const scene = state.sceneHistory.last();
    //     const json = JSON.stringify(scene.toJS());
    //     localStorage.setItem(autosaveKey, json);
    //   }, delay);
    // });
  };
}
