/* eslint-disable import/no-cycle */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
import { Catalog } from '../../../diagram';

import nodeA from './items/node-a/planner-element.jsx';
import nodeB from './items/node-b/planner-element.jsx';
import nodeC from './items/node-c/planner-element.jsx';

const Items = [nodeA, nodeB, nodeC];

const catalog = new Catalog();

for (const x in Items) catalog.registerElement(Items[x]);

export default catalog;
