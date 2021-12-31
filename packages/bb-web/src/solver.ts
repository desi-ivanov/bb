import { init, parse, toGlpk } from "bb";
import type { GLPK, LP } from "glpk.js";
import { BBSolution } from "bb/dist/BranchAndBound";
export const solveLP = (lp: (glpk: GLPK) => LP) =>
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
          GLP_INFEAS: glpk.GLP_INFEAS,
        },
      });

      return BranchAndBound(lp(glpk));
    });

export const solveRaw = async (raw: string): Promise<BBSolution> => {
  const p = parse(raw);
  return solveLP((glpk) => toGlpk(p, glpk));
};