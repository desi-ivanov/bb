import React, { useCallback, useRef, useState } from "react";
import { BBSolution, } from "bb/dist/BranchAndBound";
import { solveRaw } from "../solver";
import { Playground } from "./Playground";

const initialProblem = `max z = 2x1 + x2
1x1 -2x2 <= 3
2x1 + 3x2 <= 8
x2 <= 2`;
export const Main: React.FC = () => {
  const [solution, setSol] = useState<BBSolution | null>(null);
  const [error, setError] = useState<string | null>(null);
  const rawProb = useRef(initialProblem);

  const handleSolve = useCallback(() => {
    setError(null);
    solveRaw(rawProb.current).then(setSol).catch(setError);
  }, []);

  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        overflow: "hidden",
      }}
    >
      <div >
        <div>Problem:</div>
        <div>
          <textarea
            style={{ width: 300, height: 200 }}
            onChange={(e) => (rawProb.current = e.target.value)}
            defaultValue={initialProblem}
          ></textarea>
        </div>
        <div>
          <button onClick={handleSolve}>Solve</button>
        </div>
        {error && <div style={{ color: "red" }}>{String(error)}</div>}
      </div>
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {solution && <Playground solution={solution} />}
      </div>
    </div>
  );
};