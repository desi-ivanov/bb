import type { BBNode } from "bb/dist/BranchAndBound";
import { LP } from "glpk.js";
import React, { memo } from "react";
import { Stack } from "./Stack";

const useGlpkTranslator =
  () =>
    (context: "bnds" | "obj-direction", value: number): string => {
      if(context === "obj-direction") {
        return value === 1 ? "min" : "max";
      }
      return value === 3 ? "<=" : value === 2 ? ">=" : "=";
    };

export const SolutionInfo: React.FC<{ solution: BBNode }> = memo(
  ({ solution }) => {
    return (
      <Stack spacing={1}>
        <Stack spacing={0.5}>
          <div>
            <strong>Node</strong>: {solution.value.lp.name}
          </div>
          <div>
            <strong>Status</strong>: {solution.value.status} ({solution.value['solution']?.result.status})
          </div>
          <div>
            <strong>BestZ</strong>: {solution.value.zStarSnapshot ?
              <span>{solution.value.zStarSnapshot?.result.z}{" "}
                (Node #{solution.value.zStarSnapshot?.name})</span>
              : <span>None</span>}
          </div>
        </Stack>
        <Stack spacing={0.5}>
          <div>z: {solution.value.solution?.result.z}</div>
          <div>
            Varibles:{" "}
            {Object.entries(solution.value.solution?.result.vars ?? {}).map(
              ([k, v]) => (
                <div key={k}>{`   ${k}: ${v}`}</div>
              )
            )}
          </div>
        </Stack>

        <Stack spacing={0.5}>
          <ObjectiveFunction objective={solution.value.lp.objective} />
          {solution.value.lp.subjectTo.map((c) => (
            <div key={c.name} style={{ paddingLeft: 20 }}>
              <Constraint constraint={c} />
            </div>
          ))}
        </Stack>
      </Stack>
    );
  }
);

const ObjectiveFunction: React.FC<{ objective: LP["objective"] }> = memo(
  ({ objective }) => {
    const glpkTranslator = useGlpkTranslator();
    return (
      <Stack style={{ flexDirection: "row" }} spacing={0.25}>
        <strong>{glpkTranslator("obj-direction", objective.direction)}</strong>
        <span>z</span>
        <span>=</span>
        {objective.vars.map((v) => (
          <Variable key={v.name} variable={v} />
        ))}
      </Stack>
    );
  }
);

const Variable: React.FC<{ variable: LP["objective"]["vars"][0] }> = memo(
  ({ variable }) => {
    return (
      <span>
        {variable.coef >= 0 ? "+" : ""}
        {variable.coef}
        <span style={{ fontSize: "0.9rem", fontStyle: "oblique" }}>
          {variable.name}
        </span>
      </span>
    );
  }
);

const Constraint: React.FC<{ constraint: LP["subjectTo"][0] }> = memo(
  ({ constraint }) => {
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
  }
);
