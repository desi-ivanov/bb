import { BBNode } from "@bb/core/dist/BranchAndBound";

export const Legend = {
  current_best_solution: "#080",
  current_node: "#44f",
  visited_node: "#666",
  unvisited_node: "#ccc",
  selected_node: "#f44",
};

export const StatusToLabel: Record<Exclude<BBNode["value"]["status"], undefined>, string> = {
  bound: "Bound",
  "z-solution": "Integer",
  "r-solution": "Fractional",
  "no-solution": "Infeasible",
  unbounded: "Unbounded",
};
