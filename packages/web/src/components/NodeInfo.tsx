import type { BBNode } from "@bb/core/dist/BranchAndBound";
import { LP } from "glpk.js";
import React, { memo } from "react";
import { StatusToLabel } from "./Legend";
import { Stack } from "./Stack";

const useGlpkTranslator =
  () =>
    (context: "bnds" | "obj-direction", value: number): string => {
      if(context === "obj-direction") {
        return value === 1 ? "min" : "max";
      }
      return value === 3 ? "<=" : value === 2 ? ">=" : "=";
    };

export const NodeInfo: React.FC<{ node: BBNode }> = memo(({ node }) => {
  const glpkTranslator = useGlpkTranslator();
  return (
    <Stack spacing={1}>
      <Stack spacing={0.5}>
        <div>
          <strong>Node</strong>: {node.value.lp.name}
        </div>
        <div>
          <strong>Status</strong>: {node.value.status ? StatusToLabel[node.value.status] : "Unknown"}
        </div>
      </Stack>
      {node.value.solution && (
        <Stack spacing={0.5}>
          <div>
            <strong>z</strong> = {toFixedWrp(node.value.solution.result.z, 6)}
          </div>
          {Object.entries(node.value.solution.result.vars).map(([k, v]) => (
            <div key={k}>
              <strong>{k}</strong> = {toFixedWrp(v, 2)}
            </div>
          ))}
        </Stack>
      )}

      <Stack spacing={1} style={{ flexDirection: "row" }}>
        <Stack spacing={0.25}>
          <Stack spacing={0.25} style={{ flexDirection: "row" }}>
            <strong>{glpkTranslator("obj-direction", node.value.lp.objective.direction)}</strong>
            <span>z</span>
          </Stack>
          <span>
            <strong>sub. to</strong>
          </span>
        </Stack>
        <Stack spacing={0.5}>
          <Stack spacing={0.25} style={{ flexDirection: "row" }}>
            {node.value.lp.objective.vars.map((v) => (
              <Variable key={v.name} variable={v} />
            ))}
          </Stack>
          {node.value.lp.subjectTo.map((c) => (
            <Constraint key={c.name} constraint={c} />
          ))}
        </Stack>
      </Stack>
    </Stack>
  );
});

const toFixedWrp = (value: number, precision: number): string => {
  return Number.isInteger(value) ? String(value) : value.toFixed(precision);
};

const Variable: React.FC<{ variable: LP["objective"]["vars"][0] }> = memo(({ variable }) => {
  return (
    <span>
      {variable.coef >= 0 ? "+" : ""}
      {variable.coef}
      <span style={{ fontSize: "0.9rem", fontStyle: "oblique" }}>{variable.name}</span>
    </span>
  );
});

const Constraint: React.FC<{ constraint: LP["subjectTo"][0] }> = memo(({ constraint }) => {
  const glpkTranslator = useGlpkTranslator();
  return (
    <Stack style={{ flexDirection: "row", alignItems: "center" }} spacing={0.25}>
      {constraint.vars.map((v) => (
        <Variable key={v.name} variable={v} />
      ))}
      <span style={{ fontSize: "0.8rem" }}>{glpkTranslator("bnds", constraint.bnds.type)}</span>
      <span>{Math.max(constraint.bnds.lb, constraint.bnds.ub)}</span>
    </Stack>
  );
});
