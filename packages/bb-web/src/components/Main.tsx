import { useContextSelector } from "@fluentui/react-context-selector";
import React, { useCallback, useRef, useState } from "react";
import { Legend } from "./Legend";
import { NodeInfo } from "./NodeInfo";
import { Playground } from "./Playground";
import { PlaygroundContext } from "./PlaygroundProvider";
import { SolutionsExplorer } from "./SolutionsExplorer";
import { Stack } from "./Stack";
import { solveRaw } from "./utils";

const initialProblem = `max z = x1 + 6x2
5x1 +12x2 <= 40
- x1 +2x2 <= 3`;
export const Main: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const rawProb = useRef(initialProblem);
  const root = useContextSelector(PlaygroundContext, (x) => x.root);
  const selectedNode = useContextSelector(PlaygroundContext, (x) => x.selectedNode);
  const setSolution = useContextSelector(PlaygroundContext, (x) => x.setSolution);

  const handleSolve = useCallback(() => {
    setError(null);
    solveRaw(rawProb.current).then(setSolution).catch(setError);
  }, [setSolution]);

  return (
    <div style={{
      display: "flex",
      width: "100vw",
      height: "100vh",
      overflow: "auto hidden",
      minWidth: 700,
    }}>
      <Stack
        style={{
          flexDirection: "row",
          overflow: "hidden",
          padding: 16,
        }}
        spacing={1}
      >
        <div style={{ overflow: "auto" }}>
          <Stack spacing={1}>
            <Stack spacing={1} style={{ backgroundColor: "#eee", padding: 16 }}>
              <div><strong>Problem</strong></div>
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
            <div style={{ backgroundColor: "#eee", padding: 16 }}>
              <Stack spacing={1}>
                <strong>Legend</strong>
                {Object.entries(Legend).map(([k, v]) => (
                  <Stack
                    key={k}
                    style={{ flexDirection: "row", alignItems: "center" }}
                    spacing={0.5}
                  >
                    <div style={{ width: 20, height: 20, backgroundColor: v }} />
                    <span>{k}</span>
                  </Stack>
                ))}
              </Stack>
            </div>
            <div style={{ backgroundColor: "#eee", padding: 16 }}>
              <SolutionsExplorer />
            </div>
            {selectedNode && <div style={{ backgroundColor: "#eee", padding: 16 }}>
              <NodeInfo node={selectedNode} />
            </div>}
          </Stack>
        </div>
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            backgroundColor: "#eee",
          }}
        >
          {root && <Playground root={root} />}
        </div>
      </Stack>
    </div>
  );
};
