import React from "react";
import { useSelector } from "../hooks/useSelector";
import { PlaygroundContext, useCurrentNode } from "./PlaygroundProvider";
import { NodeInfo } from "./NodeInfo";
import { Stack } from "./Stack";

export const SolutionsExplorer: React.FC = () => {
  const currentNode = useCurrentNode();
  const prevNode = useSelector(PlaygroundContext, x => x.prevNode);
  const nextNode = useSelector(PlaygroundContext, x => x.nextNode);
  return (
    currentNode && (
      <Stack spacing={1} style={{ backgroundColor: "#eee", padding: 10 }}>
        <strong>Solution explorer</strong>
        <Stack style={{ flexDirection: "row", }} spacing={1}>
          <button onClick={prevNode}>Prev node</button>
          <button onClick={nextNode}>Next node</button>
        </Stack>
        <NodeInfo node={currentNode} />
      </Stack>
    )
  );
};
