import { BBNode } from "bb/dist/BranchAndBound";
import React from "react";
import { useSelector } from "../hooks/useSelector";
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
    const selectNode = useSelector(PlaygroundContext, s => s.selectNode);
    const isSelected = useSelector(PlaygroundContext, s => s.selectedNode === node);
    const isBest = currentNode?.value.zStarSnapshot?.name === node.value.lp.name;
    const x = startX + dedicatedWidth / 2;
    const y = startY;

    const handleClickNode = () => isSelected ? selectNode(null) : selectNode(node);

    return !isVisited ? (
      <></>
    ) : (
      <React.Fragment key={node.value.lp.name}>
        {parentX !== undefined && parentY !== undefined && (
          <>
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
          </>
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
        >
          <circle
            cx={zoom * x}
            cy={zoom * y}
            r={zoom * 20}
            fill={
              Legend[
              isSelected
                ? "selected_node"
                : isBest
                  ? "current_best_solution"
                  : currentNode === node
                    ? "current_node"
                    : "visited_node"
              ]
            }
          />
          <text
            x={zoom * x}
            y={zoom * y}
            textAnchor="middle"
            alignmentBaseline="middle"
            fontWeight={800}
            fill="#fff"
            fontSize={zoom * 15}
          >
            {node.value.lp.name}
          </text>
          <text
            x={zoom * x}
            y={zoom * (y - 30)}
            textAnchor="middle"
            alignmentBaseline="middle"
            fontWeight={800}
            fontSize={zoom * 15}
          >
            {node.value.status}
          </text>
          <text
            x={zoom * x}
            y={zoom * (y + 30)}
            textAnchor="middle"
            alignmentBaseline="middle"
            fontWeight={800}
            fontSize={zoom * 15}
          >
            {node.value.solution?.result.z.toFixed(2)}
          </text>
        </g>
      </React.Fragment>
    );
  };