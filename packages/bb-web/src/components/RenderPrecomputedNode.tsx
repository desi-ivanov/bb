import React from "react";
import { Legend } from "./Legend";
import { useCurrentNode, useIsVisited } from "./PlaygroundProvider";
import { PrecomputedNode } from "./utils";

export const RenderPrecomputedNode: React.FC<{
  node: PrecomputedNode;
  parentX?: number;
  parentY?: number;
}> = ({ node, parentX, parentY }) => {
  const currentNode = useCurrentNode();
  const isVisited = useIsVisited(node.value.bbNode);
  const isBest =
    currentNode?.value.zStarSnapshot?.name === node.value.bbNode.value.lp.name;
  return !isVisited ? (
    <></>
  ) : (
    <React.Fragment key={node.value.bbNode.value.lp.name}>
      {parentX !== undefined && parentY !== undefined && (
        <>
          <line
            x1={parentX}
            y1={parentY}
            x2={node.value.x}
            y2={node.value.y}
            stroke="#444"
            strokeWidth={0.5}
          />
          <text
            x={node.value.x + (parentX - node.value.x) / 2}
            y={node.value.y + (parentY - node.value.y) / 2}
            textAnchor="middle"
            fontWeight={700}
          >
            {node.value.bbNode.value.label}
          </text>
        </>
      )}
      {isVisited &&
        [node.left, node.right]
          .filter(
            (child): child is Exclude<typeof child, undefined> =>
              child !== undefined
          )
          .map((child) => (
            <RenderPrecomputedNode
              key={
                node.value.bbNode.value.lp.name +
                "-" +
                child.value.bbNode.value.lp.name
              }
              parentX={node.value.x}
              parentY={node.value.y}
              node={child}
            />
          ))}
      <g>
        <circle
          cx={node.value.x}
          cy={node.value.y}
          r={20}
          fill={
            Legend[
              isBest
                ? "current_best_solution"
                : currentNode === node.value.bbNode
                ? "current_node"
                : "visited_node"
            ]
          }
        />
        <text
          x={node.value.x}
          y={node.value.y}
          textAnchor="middle"
          alignmentBaseline="middle"
          fontWeight={800}
          fill="#fff"
        >
          {node.value.bbNode.value.lp.name}
        </text>
        <text
          x={node.value.x}
          y={node.value.y - 30}
          textAnchor="middle"
          alignmentBaseline="middle"
          fontWeight={800}
        >
          {node.value.bbNode.value.status}
        </text>
        <text
          x={node.value.x}
          y={node.value.y + 30}
          textAnchor="middle"
          alignmentBaseline="middle"
          fontWeight={800}
        >
          {node.value.bbNode.value.solution?.result.z.toFixed(2)}
        </text>
      </g>
    </React.Fragment>
  );
};
