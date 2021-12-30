
import GLPK from 'glpk.js';
import { glpk } from "./glpk";
import { Stack } from "./Stack";

type Node<T> = { value: T, parent: Node<T> | null }
type BBNode = Node<{ lp: GLPK.LP, solution?: GLPK.Result, label?: string }>;

const statusMap = {
  [glpk.GLP_UNDEF]: "GLP_UNDEF",
  [glpk.GLP_FEAS]: "GLP_FEAS",
  [glpk.GLP_INFEAS]: "GLP_INFEAS",
  [glpk.GLP_NOFEAS]: "GLP_NOFEAS",
  [glpk.GLP_OPT]: "GLP_OPT",
  [glpk.GLP_UNBND]: "GLP_UNBND",
}

const Branch = (mainNode: BBNode, leftName: string, rightName: string, [name, value]: [string, number]): [BBNode, BBNode] => {
  const leftVarBound = Math.floor(value);
  const rightVarBound = Math.ceil(value);
  const leftLabel = `${name}<=${leftVarBound}`;
  const rightLabel = `${name}>=${rightVarBound}`;
  const left: GLPK.LP = {
    ...mainNode.value.lp,
    name: leftName,
    subjectTo: [
      ...mainNode.value.lp.subjectTo,
      {
        name: leftLabel,
        vars: [
          { name, coef: 1.0 },
        ],
        bnds: { type: glpk.GLP_UP, ub: leftVarBound, lb: 0.0 }
      }
    ]
  };
  const right: GLPK.LP = {
    ...mainNode.value.lp,
    name: rightName,
    subjectTo: [
      ...mainNode.value.lp.subjectTo,
      {
        name: rightLabel,
        vars: [
          { name, coef: 1.0 },
        ],
        bnds: { type: glpk.GLP_LO, ub: 0.0, lb: rightVarBound }
      }
    ]
  };
  return [
    { value: { lp: left, label: leftLabel }, parent: mainNode },
    { value: { lp: right, label: rightLabel }, parent: mainNode }
  ];
}


const IdGenerator = () => {
  let i = 0;
  return { next: () => String(i++) }
}

export const BranchAndBound = (initial: GLPK.LP): {
  glpkRes: GLPK.Result | null,
  nodes: BBNode[]
} => {
  const stack = Stack<BBNode>();
  const idGenerator = IdGenerator();
  const nodes: BBNode[] = [];
  let zsol: GLPK.Result | null = null;

  stack.push({ value: { lp: initial }, parent: null });

  while(!stack.empty()) {
    const currentNode = stack.popOrThrow();
    const sol = glpk.solve(currentNode.value.lp, {
      msglev: glpk.GLP_MSG_OFF,
      presol: true,
    });
    currentNode.value.solution = sol;
    console.log(sol.result);

    if(sol.result.status === glpk.GLP_INFEAS) {
      continue
    }
    if(zsol !== null && zsol.result.z > sol.result.z) {
      // upperbound
      continue
    }

    const fractionalVar = Object.entries(sol.result.vars).find(([_, v]) => !Number.isInteger(v));

    if(fractionalVar === undefined) {
      if(zsol === null || sol.result.z > zsol.result.z) {
        // new optimal solution
        zsol = sol;
      }
      continue;
    }

    const [p1, p2] = Branch(currentNode, idGenerator.next(), idGenerator.next(), fractionalVar);

    stack.push(p1);
    stack.push(p2);

    nodes.push(p1);
    nodes.push(p2);
  }
  return {
    glpkRes: zsol,
    nodes,
  };
}
