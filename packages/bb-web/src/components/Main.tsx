import React, { useCallback, useRef, useState } from "react";
import { useSelector } from "../hooks/useSelector";
import { Playground } from "./Playground";
import { PlaygroundContext } from "./PlaygroundProvider";
import { SolutionsExplorer } from "./SolutionsExplorer";
import { Stack } from "./Stack";
import { solveRaw } from "./utils";

const initialProblem = `max z = 2x1 + x2
1x1 -2x2 <= 3
2x1 + 3x2 <= 8
x2 <= 2`;
export const Main: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const rawProb = useRef(initialProblem);
  const root = useSelector(PlaygroundContext, (x) => x.root);
  const setSolution = useSelector(PlaygroundContext, (x) => x.setSolution);

  const handleSolve = useCallback(() => {
    setError(null);
    solveRaw(rawProb.current).then(setSolution).catch(setError);
  }, [setSolution]);

  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        overflow: "hidden",
      }}
    >
      <div style={{ padding: 20 }}>
        <Stack spacing={2}>
          <Stack spacing={1} style={{ backgroundColor: "#eee", padding: 10 }}>
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
          </Stack>
          <SolutionsExplorer />
        </Stack>
      </div>
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          backgroundColor: "#e3e3e3",

        }}
      >
        {root && <Playground root={root} />}
      </div>
    </div>
  );
};
