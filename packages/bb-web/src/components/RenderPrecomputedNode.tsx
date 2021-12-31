import React  from "react";
import { PrecomputedNode } from "./utils";

export const RenderPrecomputedNode: React.FC<{ node: PrecomputedNode }> = ({
  node,
}) => {
  return (
    <React.Fragment key={node.value.bbNode.value.lp.name}>
      {[node.left, node.right]
        .filter(
          (def): def is Exclude<typeof def, undefined> => def !== undefined
        )
        .map((child) => (
          <React.Fragment
            key={
              node.value.bbNode.value.lp.name +
              "-" +
              child.value.bbNode.value.lp.name
            }
          >
            <line
              x1={node.value.x}
              y1={node.value.y}
              x2={child.value.x}
              y2={child.value.y}
              stroke="#444"
              strokeWidth={0.5}
            />
            <text
              x={child.value.x + (node.value.x - child.value.x) / 2}
              y={child.value.y + (node.value.y - child.value.y) / 2}
              textAnchor="middle"
              fontWeight={700}

            >
              {child.value.bbNode.value.label}
            </text>
            <RenderPrecomputedNode node={child} />
          </React.Fragment>
        ))}
      <circle cx={node.value.x} cy={node.value.y} r={20} stroke="#000"/>
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
    </React.Fragment>
  );
};