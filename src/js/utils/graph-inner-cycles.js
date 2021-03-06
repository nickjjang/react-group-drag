import { List } from 'immutable';
import Graph from './graph';
import getEdgesOfSubgraphs from './get-edges-of-subgraphs';
import graphCycles from './graph-cycles';

export default function calculateInnerCycles(verticesArray, edgesArray) {
  let innerCycles = new List();

  const graph = new Graph(verticesArray.length);
  edgesArray.forEach((line) => {
    graph.addEdge(line[0], line[1]);
    graph.addEdge(line[1], line[0]);
  });

  graph.BCC();

  const subgraphs = graph.subgraphs.filter(subgraph => subgraph.length >= 3);
  const edgesOfSubgraphsArray = getEdgesOfSubgraphs(subgraphs, graph);

  const edges = [];
  edgesOfSubgraphsArray.forEach((es) => {
    es.forEach(edge => edges.push(edge));
  });

  const cycles = graphCycles(verticesArray, edges);
  cycles.v_cycles.forEach((cycle) => {
    cycle.shift();
    innerCycles = innerCycles.push(cycle);
  });

  return innerCycles;
}

export function isClockWiseOrder(innerCycleWithCoords) {
  // See: https://stackoverflow.com/a/1165943 and http://blog.element84.com/polygon-winding.html

  let i = 0;
  let twiceEnclosedArea = 0;
  const { size } = innerCycleWithCoords;

  for (i = 0; i < size; i++) {
    const { x: x1, y: y1 } = innerCycleWithCoords.get(i);
    const { x: x2, y: y2 } = innerCycleWithCoords.get((i + 1) % size);

    twiceEnclosedArea += (x2 - x1) * (y2 + y1);
  }

  return twiceEnclosedArea > 0;
}
