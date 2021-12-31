import { BBNode, BBSolution } from "bb/dist/BranchAndBound";
import React, { useCallback, useRef, useState } from "react";
import { useSelector } from "../hooks/useSelector";
import { precompute, PrecomputedNode } from "./utils";

export type PlaygroundType = {
  root: PrecomputedNode | null;
  currentNode: BBNode | null;
  solution: BBSolution | null
  isVisited: (node: BBNode) => boolean;
  addVisited: (node: BBNode) => void;
  removeVisited: (node: BBNode) => void;
  setSolution: (sol: BBSolution) => void
  prevNode: () => void;
  nextNode: () => void;
};

export const PlaygroundContext = React.createContext<PlaygroundType>({
  setSolution: () => { },
  solution: null,
  root: null,
  currentNode: null,
  isVisited: () => false,
  addVisited: () => { },
  removeVisited: () => { },
  nextNode: () => { },
  prevNode: () => { }
});

export const PlaygroundProvider: React.FC = ({ children }) => {
  const [currentNode, setCurrentNode] = useState<BBNode | null>(null);
  const [root, setRoot] = useState<PrecomputedNode | null>(null);
  const [solution, setCurrentSolution] = useState<BBSolution | null>(null);
  const [visited, setVisited] = useState<Record<string, boolean | undefined>>({});
  const idxRef = useRef(0);

  const isVisited = useCallback((node: BBNode) => visited[node.value.lp.name] === true, [visited]);
  const addVisited = useCallback((node: BBNode) => setVisited(vs => ({ ...vs, [node.value.lp.name]: true })), []);
  const removeVisited = useCallback((node: BBNode) => setVisited(vs => ({ ...vs, [node.value.lp.name]: undefined })), []);

  const setSolution = useCallback((sol: BBSolution | null) => {
    const YSpacing = 150;
    const XSpacing = 110;
    setCurrentSolution(sol);
    idxRef.current = 0;
    if(sol) {
      const root = precompute(sol, XSpacing, YSpacing);
      setRoot(root);
      setCurrentNode(root.value.bbNode);
      setVisited(root ? { [root.value.bbNode.value.lp.name]: true } : {});
    }
  }, []);

  const prevNode = useCallback(() => {
    if(solution) {
      const x = solution.order[idxRef.current];
      if(x && idxRef.current > 0) removeVisited(x);
      idxRef.current = Math.max(0, idxRef.current - 1);
      setCurrentNode(solution.order[idxRef.current]);
    }
  }, [removeVisited, solution]);


  const nextNode = useCallback(() => {
    if(solution) {
      idxRef.current = Math.min(solution.order.length - 1, idxRef.current + 1);
      setCurrentNode(solution.order[idxRef.current]);
      const x = solution?.order[idxRef.current];
      if(x) addVisited(x);
    }
  }, [addVisited, solution]);

  return (
    <PlaygroundContext.Provider value={{
      prevNode,
      nextNode,
      solution, currentNode, setSolution, root, isVisited, addVisited, removeVisited
    }}>
      {children}
    </PlaygroundContext.Provider>
  );
};

export const useCurrentNode = () => useSelector(PlaygroundContext, x => x.currentNode);
export const useRoot = () => useSelector(PlaygroundContext, x => x.root);
export const useIsVisited = (node: BBNode) => useSelector(PlaygroundContext, x => x.isVisited(node));
export const useAddVisited = () => useSelector(PlaygroundContext, x => x.addVisited);
export const useRemoveVisited = () => useSelector(PlaygroundContext, x => x.removeVisited);

