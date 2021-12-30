
import { init } from "./BranchAndBound";
import { Knapsack } from "./Knapsack";
import GLPK from 'glpk.js';
const mkglpk = (): GLPK.GLPK => (GLPK as () => GLPK.GLPK)();
export const glpk = mkglpk();

const p = Knapsack(glpk, [
  { weight: 4, value: 4 },

  { weight: 6, value: 6 },

  { weight: 1, value: 20 },

  { weight: 5, value: 5 },
], 10)

const { BranchAndBound } = init({
  solve: (lp: GLPK.LP) => Promise.resolve(glpk.solve(lp, {
    msglev: glpk.GLP_MSG_OFF,
    presol: true,
  })),
  constants: {
    GLP_LO: glpk.GLP_LO,
    GLP_UP: glpk.GLP_UP,
    GLP_INFEAS: glpk.GLP_INFEAS,
  }
});


BranchAndBound(
  {
    name: 'demo2',
    objective: {
      direction: glpk.GLP_MAX,
      name: 'obj',
      vars: [2, 1].map((itm, i) => ({ name: `x${i}`, coef: itm }))
    },
    subjectTo: [
      {
        name: "c1",
        vars: [1, -2].map((itm, i) => ({ name: `x${i}`, coef: itm })),
        bnds: { type: glpk.GLP_UP, ub: 3, lb: 0 }
      },
      {
        name: "c2",
        vars: [2, 3].map((itm, i) => ({ name: `x${i}`, coef: itm })),
        bnds: { type: glpk.GLP_UP, ub: 8, lb: 0 }
      },
      {
        name: "c3",
        vars: [0, 1].map((itm, i) => ({ name: `x${i}`, coef: itm })),
        bnds: { type: glpk.GLP_UP, ub: 2, lb: 0 }
      },
    ]
  }
).then(console.log)

