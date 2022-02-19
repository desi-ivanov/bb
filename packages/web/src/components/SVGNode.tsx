import { BBNode } from "@bb/core/dist/BranchAndBound";
import { useContextSelector } from "@fluentui/react-context-selector";
import React from "react";
import { Legend } from "./Legend";
import { PlaygroundContext, useCurrentNode, useIsVisited } from "./PlaygroundProvider";

export const SVGNode: React.FC<{
  node: BBNode;
  parentX?: number;
  parentY?: number;
  startX: number;
  startY: number;
  dedicatedWidth: number;
  ySpacing: number;
  zoom: number;
}> = ({
  node,
  parentX,
  parentY,
  startX,
  startY,
  dedicatedWidth,
  ySpacing,
  zoom
}) => {
    const currentNode = useCurrentNode();
    const isVisited = useIsVisited(node);
    const selectNode = useContextSelector(PlaygroundContext, s => s.selectNode);
    const isSelected = useContextSelector(PlaygroundContext, s => s.selectedNode === node);
    const isBest = currentNode?.value.zStarSnapshot?.name === node.value.lp.name;
    const x = startX + dedicatedWidth / 2;
    const y = startY;

    const handleClickNode = () => isSelected ? selectNode(null) : selectNode(node);

    return <React.Fragment key={node.value.lp.name}>
      {parentX !== undefined && parentY !== undefined && (
        <g opacity={isVisited ? 1 : 0.5}>
          <line
            x1={zoom * parentX}
            y1={zoom * parentY}
            x2={zoom * x}
            y2={zoom * y}
            stroke="#444"
            strokeWidth={0.5}
          />
          <text
            x={zoom * (x + (parentX - x) / 2)}
            y={zoom * (y + (parentY - y) / 2)}
            textAnchor="middle"
            fontWeight={700}
            fontSize={zoom * 15}
          >
            {node.value.label}
          </text>
        </g>
      )}
      {node.left && (
        <SVGNode
          parentX={x}
          parentY={y}
          startX={startX}
          startY={startY + ySpacing}
          dedicatedWidth={dedicatedWidth / 2}
          ySpacing={ySpacing}
          node={node.left}
          zoom={zoom}
        />
      )}
      {node.right && (
        <SVGNode
          parentX={x}
          parentY={y}
          startX={startX + dedicatedWidth / 2}
          startY={startY + ySpacing}
          dedicatedWidth={dedicatedWidth / 2}
          ySpacing={ySpacing}
          node={node.right}
          zoom={zoom}
        />
      )}
      <g
        onClick={handleClickNode}
        opacity={isVisited ? 1 : 0.5}
      >
        <text
          x={zoom * x}
          y={zoom * (y - 35)}
          textAnchor="middle"
          alignmentBaseline="middle"
          fontWeight={500}
          fontSize={zoom * 14}
        >
          #{node.value.lp.name} {node.value.status}
        </text>
        <circle
          cx={zoom * x}
          cy={zoom * y}
          r={zoom * 24}
          fill={
            Legend[
            isSelected
              ? "selected_node"
              : isBest
                ? "current_best_solution"
                : currentNode === node
                  ? "current_node"
                  : isVisited
                    ? "visited_node"
                    : "unvisited_node"
            ]
          }
        />
        <text
          x={zoom * x}
          y={zoom * y}
          textAnchor="middle"
          alignmentBaseline="middle"
          fontWeight={600}
          fill="#fff"
          fontSize={zoom * 12}
        >
          {node.value.solution?.result.z.toFixed(1)}
        </text>
      </g>
    </React.Fragment>
  };
