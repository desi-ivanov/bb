import { init, parse, toGlpk } from "@bb/core";
import type { GLPK, LP } from "glpk.js";
import { BBSolution, BBNode, ExplorationMode } from "@bb/core/dist/BranchAndBound";

export const solveLP = (lp: (glpk: GLPK) => LP, exploration: ExplorationMode) =>
  import("glpk.js")
    .then(({ default: loadGlpk }) => (loadGlpk as () => Promise<GLPK>)())
    .then((glpk) => {
      const { BranchAndBound } = init({
        solve: async (p) =>
          glpk.solve(p, {
            msglev: glpk.GLP_MSG_OFF,
            presol: true,
          }),
        constants: {
          GLP_LO: glpk.GLP_LO,
          GLP_UP: glpk.GLP_UP,
          GLP_UNBND: glpk.GLP_UNBND,
          GLP_UNDEF: glpk.GLP_UNDEF,
        },
      });

      return BranchAndBound(lp(glpk), exploration);
    });

export const solveRaw = async (raw: string, exploration: ExplorationMode): Promise<BBSolution> => {
  const p = parse(raw);
  return solveLP((glpk) => toGlpk(p, glpk), exploration);
};

export const depth = (x: BBNode): number => 1 + Math.max(x.left ? depth(x.left) : 0, x.right ? depth(x.right) : 0);
