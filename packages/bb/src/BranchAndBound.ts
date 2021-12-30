import type { LP, Result } from 'glpk.js';
import { Stack } from "./Stack";

type Node<T> = { value: T, parent: Node<T> | null }
type BBNode = Node<{ lp: LP, solution?: Result, label?: string }>;
type Init = {
  solve: (lp: LP) => Promise<Result>,
  constants: {
    GLP_LO: number,
    GLP_UP: number
    GLP_INFEAS: number,
  }
}

export const init = ({ solve, constants: { GLP_LO, GLP_UP, GLP_INFEAS } }: Init) => {
  const Branch = (mainNode: BBNode, leftName: string, rightName: string, [name, value]: [string, number]): [BBNode, BBNode] => {
    const leftVarBound = Math.floor(value);
    const rightVarBound = Math.ceil(value);
    const leftLabel = `${name}<=${leftVarBound}`;
    const rightLabel = `${name}>=${rightVarBound}`;
    const left: LP = {
      ...mainNode.value.lp,
      name: leftName,
      subjectTo: [
        ...mainNode.value.lp.subjectTo,
        {
          name: leftLabel,
          vars: [
            { name, coef: 1.0 },
          ],
          bnds: { type: GLP_UP, ub: leftVarBound, lb: 0.0 }
        }
      ]
    };
    const right: LP = {
      ...mainNode.value.lp,
      name: rightName,
      subjectTo: [
        ...mainNode.value.lp.subjectTo,
        {
          name: rightLabel,
          vars: [
            { name, coef: 1.0 },
          ],
          bnds: { type: GLP_LO, ub: 0.0, lb: rightVarBound }
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

  const BranchAndBound = async (initial: LP): Promise<{
    glpkRes: Result | null,
    nodes: BBNode[]
  }> => {
    const stack = Stack<BBNode>();
    const idGenerator = IdGenerator();
    const nodes: BBNode[] = [];
    let zsol: Result | null = null;

    stack.push({ value: { lp: initial }, parent: null });

    while(!stack.empty()) {
      const currentNode = stack.popOrThrow();
      const sol = await solve(currentNode.value.lp);
      currentNode.value.solution = sol;

      if(sol.result.status === GLP_INFEAS) {
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
  return { BranchAndBound }
}