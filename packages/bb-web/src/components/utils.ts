
import { init, parse, toGlpk } from "bb";
import type { GLPK, LP } from "glpk.js";
import { BBSolution, BBNode, Node } from "bb/dist/BranchAndBound";

export type PrecomputedNode = Node<{
  bbNode: BBNode;
  x: number;
  y: number;
}>;

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
          GLP_UNDEF: glpk.GLP_UNDEF
        },
      });

      return BranchAndBound(lp(glpk));
    });

export const solveRaw = async (raw: string): Promise<BBSolution> => {
  const p = parse(raw);
  return solveLP((glpk) => toGlpk(p, glpk));
};

const depth = (x: BBNode): number =>
  1 + Math.max(x.left ? depth(x.left) : 0, x.right ? depth(x.right) : 0);

export const precompute = (solution: BBSolution, XSpacing: number, YSpacing: number): PrecomputedNode => {
  const d = depth(solution.root);
  return precomputeRic(solution.root, 0, 2 ** (d - 1) * XSpacing, 0, XSpacing, YSpacing);
};

const precomputeRic = (
  bbNode: BBNode,
  start: number,
  width: number,
  y: number,
  XSpacing: number,
  YSpacing: number
): PrecomputedNode => {
  return {
    value: { bbNode: bbNode, x: start + width / 2, y },
    left: bbNode.left
      ? precomputeRic(bbNode.left, start, width / 2, y + YSpacing, XSpacing, YSpacing)
      : undefined,
    right: bbNode.right
      ? precomputeRic(bbNode.right, start + width / 2, width / 2, y + YSpacing, XSpacing, YSpacing)
      : undefined,
  };
};
