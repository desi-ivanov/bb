
import { BranchAndBound } from "./BranchAndBound";
import { glpk } from "./glpk";
import { Knapsack } from "./Knapsack";

const p = Knapsack([
  { weight: 4, value: 4 },

  { weight: 6, value: 6 },

  { weight: 1, value: 20 },

  { weight: 5, value: 5 },
], 10)

console.log(BranchAndBound(p));

console.log(
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
  )
)