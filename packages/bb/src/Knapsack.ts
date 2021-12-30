import GLPK from 'glpk.js';


export const Knapsack = (glpk: GLPK.GLPK, items: { weight: number, value: number }[], capacity: number): GLPK.LP => {
  return {
    name: 'Knapsack',
    objective: {
      direction: glpk.GLP_MAX,
      name: 'obj',
      vars: items.map((itm, i) => ({ name: `x${i}`, coef: itm.value }))
    },
    subjectTo: [
      {
        name: "main",
        vars: items.map((itm, i) => ({
          name: `x${i}`, coef: itm.weight
        })),
        bnds: { type: glpk.GLP_UP, ub: capacity, lb: 0 }
      },
      ...items.map((itm, i) => ({
        name: `x${i}binrelax`,
        vars: [{ name: "x" + i, coef: 1 }],
        bnds: { type: glpk.GLP_DB, lb: 0, ub: 1 }
      })),
    ]
  };
}