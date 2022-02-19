import React from 'react'
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import js from 'react-syntax-highlighter/dist/esm/languages/hljs/javascript';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';

SyntaxHighlighter.registerLanguage('javascript', js);

export const PseudocodeModal: React.VFC<{ onClose: () => void }> = ({ onClose }) => {
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0, padding: 16, zIndex: 2000, background: "#fff", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <strong>Pseudocode</strong>
        <div onClick={onClose} style={{ cursor: "pointer" }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <line x1="18" y1="6" x2="6" y2="18" stroke="black" strokeWidth="2" />
            <line x1="6" y1="6" x2="18" y2="18" stroke="black" strokeWidth="2" />
          </svg>
        </div>
      </div>
      <SyntaxHighlighter language="javascript" style={docco}>{`async function BranchAndBound(initialProblem, strategy) {
  // The frontier keeps all currently open nodes
  // - for Best-First strategy, the frontier is a priority queue 
  //   where the priority is the value of the objective function of the solution
  // - for BFS strategy, the frontier is a queue
  // - for DFS strategy, the frontier is a stack
  let frontier = strategy === "best-first" ? new PriorityQueue(x => x.solution.z) 
               : strategy === "bfs" ? new Queue() 
               : new Stack();
  let root = new Node(initialProblem);
  frontier.add(root);

  // bestIntSol is the best integer solution found so far
  let bestIntSol = null;

  while(!frontier.empty()) {
    // extract the next node from the frontier
    // and compute it's solution with GLPK

    let node = frontier.extract();
    let sol = await GLPK.solve(node);
    node.solution = sol;

    // if there is no solution, mark the node as closed and continue
    if(sol.status === GLPK.GLP_UNDEF) 
      node.label = "no-solution"

    // if there is already an integer solution which has a greater objective value,
    // mark this node as closed by bound and continue the search
    else if(bestIntSol !== null && bestIntSol.z >= sol.z) 
      node.label = "bound"

    // at this point, the node has a solution with a potentially greater objective value
    else {
      // Find a fractional variable, if it exists
      let RVar = sol.vars.find((var) => !Number.isInteger(var.value));

      if(RVar === undefined) {
        // We couldn't find any fractional variable in the solution, thus we have an integer solution.
        // Since the current bestIntSol at this point is either null or has a lower objective 
        // value than this solution, we update the bestIntSol to this solution

        node.label = "z-solution"; 
        bestIntSol = sol; 

      } else {
        // The solution has a fractional variable RVar
        // We branch on RVar and generate two new subproblems:
        // - the first with RVar constrained to a lower value than the floor of it's current value
        // - the second with RVar constrained to a higher value than the ceil of it's current value

        node.label = "r-solution"

        frontier.add(
          node.withConstraint(RVar.name, GLPK.GLP_UP, Math.floor(RVar.value)))))
        );

        frontier.add(
          node.withConstraint(RVar.name, GLPK.GLP_LO, Math.ceil(RVar.value)))))
        );

      }
    }
  }
  return { best, root };
}
`}
      </SyntaxHighlighter>
    </div>
  )
}
