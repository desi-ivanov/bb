import type { LP, Result } from "glpk.js";
import { PriorityQueue } from "./PriorityQueue";
import { AbstractQueue, Queue } from "./Queue";
import { Stack } from "./Stack";

export type Node<T> = {
  value: T;
  parent?: Node<T>;
  left?: Node<T>;
  right?: Node<T>;
};
export type BBNode = Node<{
  lp: LP;
  solution?: Result;
  label?: string;
  status?: "z-solution" | "r-solution" | "bound" | "unfeasible" | "no-solution";
  zStarSnapshot: Result | null;
}>;
export type ExplorationMode = "dfs" | "bfs" | "best-first";
export type BBInit = {
  solve: (lp: LP) => Promise<Result>;
  constants: {
    GLP_LO: number;
    GLP_UP: number;
    GLP_INFEAS: number;
    GLP_UNDEF: number;
  };
};
export type BBSolution = {
  glpkRes: Result | null;
  root: BBNode;
  order: BBNode[];
};

export const init = ({
  solve,
  constants: { GLP_LO, GLP_UP, GLP_INFEAS, GLP_UNDEF },
}: BBInit) => {
  const Branch = (
    mainNode: BBNode,
    leftName: string,
    rightName: string,
    [name, value]: [string, number]
  ): [BBNode, BBNode] => {
    const leftVarBound = Math.floor(value);
    const rightVarBound = Math.ceil(value);
    const leftLabel = `${name}≤${leftVarBound}`;
    const rightLabel = `${name}≥${rightVarBound}`;
    const left: LP = {
      ...mainNode.value.lp,
      name: leftName,
      subjectTo: [
        ...mainNode.value.lp.subjectTo,
        {
          name: leftLabel,
          vars: [{ name, coef: 1.0 }],
          bnds: { type: GLP_UP, ub: leftVarBound, lb: 0.0 },
        },
      ],
    };
    const right: LP = {
      ...mainNode.value.lp,
      name: rightName,
      subjectTo: [
        ...mainNode.value.lp.subjectTo,
        {
          name: rightLabel,
          vars: [{ name, coef: 1.0 }],
          bnds: { type: GLP_LO, ub: 0.0, lb: rightVarBound },
        },
      ],
    };
    return [
      {
        value: { lp: left, label: leftLabel, zStarSnapshot: null },
        parent: mainNode,
      },
      {
        value: { lp: right, label: rightLabel, zStarSnapshot: null },
        parent: mainNode,
      },
    ];
  };

  const IdGenerator = () => {
    let i = 0;
    return { next: () => String(i++) };
  };

  const BranchAndBound = async (
    initial: LP,
    exploration: ExplorationMode
  ): Promise<BBSolution> => {
    const q =
      exploration === "bfs"
        ? Queue<BBNode>()
        : exploration === "dfs"
        ? Stack<BBNode>()
        : PriorityQueue<BBNode>((x) => x.parent?.value.solution?.result.z ?? 0);
    const idGenerator = IdGenerator();
    let zStar: Result | null = null;
    const root: BBNode = {
      value: {
        lp: { ...initial, name: idGenerator.next() },
        zStarSnapshot: null,
      },
    };
    const order = [];
    q.add(root);

    while (!q.empty()) {
      const currentNode = q.nextOrThrow();
      order.push(currentNode);
      const sol = await solve(currentNode.value.lp);
      currentNode.value.solution = sol;
      currentNode.value.zStarSnapshot = zStar;

      if (sol.result.status === GLP_INFEAS) {
        currentNode.value.status = "unfeasible";
        continue;
      }
      if (sol.result.status === GLP_UNDEF) {
        currentNode.value.status = "no-solution";
        continue;
      }

      if (zStar !== null && zStar.result.z >= sol.result.z) {
        currentNode.value.status = "bound";
        // upperbound
        continue;
      }

      const fractionalVar = Object.entries(sol.result.vars).find(
        ([_, v]) => !Number.isInteger(v)
      );

      if (fractionalVar === undefined) {
        zStar = sol;
        currentNode.value.status = "z-solution";
        currentNode.value.zStarSnapshot = sol;
        continue;
      }
      currentNode.value.status = "r-solution";

      const [p1, p2] = Branch(
        currentNode,
        idGenerator.next(),
        idGenerator.next(),
        fractionalVar
      );

      q.add(exploration === "bfs" ? p1 : p2);
      q.add(exploration === "bfs" ? p2 : p1);
      currentNode.left = p1;
      currentNode.right = p2;
    }
    return {
      glpkRes: zStar,
      root,
      order,
    };
  };
  return { BranchAndBound };
};
