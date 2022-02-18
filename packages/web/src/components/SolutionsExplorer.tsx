import React from "react";
import { PlaygroundContext, useCurrentNode } from "./PlaygroundProvider";
import { NodeInfo } from "./NodeInfo";
import { Stack } from "./Stack";
import { useContextSelector } from "@fluentui/react-context-selector";

export const SolutionsExplorer: React.FC = () => {
  const currentNode = useCurrentNode();
  const prevNode = useContextSelector(PlaygroundContext, x => x.prevNode);
  const nextNode = useContextSelector(PlaygroundContext, x => x.nextNode);
  return (
    currentNode && (
      <Stack spacing={1}>
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
