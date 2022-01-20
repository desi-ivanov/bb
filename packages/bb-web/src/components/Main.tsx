import { useContextSelector } from "@fluentui/react-context-selector";
import React, { useCallback, useRef, useState } from "react";
import { Legend } from "./Legend";
import { NodeInfo } from "./NodeInfo";
import { Playground } from "./Playground";
import { PlaygroundContext } from "./PlaygroundProvider";
import { SolutionsExplorer } from "./SolutionsExplorer";
import { Stack } from "./Stack";
import { solveRaw } from "./utils";

const example2 = `max z = x1 + 2x2 + 4x3 + 7x4

2x1 + 5x2 + 2x3 + 7x4 <= 10

x1 <= 1
x2 <= 1
x3 <= 1
x4 <= 1

x1 >= 0
x2 >= 0
x3 >= 0
x4 >= 0`

const initialProblem = `max z = x1 + 6x2

5x1 +12x2 <= 40
- x1 +2x2 <= 3

x1 >= 0
x2 >= 0`;
export const Main: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const rawProb = useRef(example2);
  const root = useContextSelector(PlaygroundContext, (x) => x.root);
  const selectedNode = useContextSelector(PlaygroundContext, (x) => x.selectedNode);
  const setSolution = useContextSelector(PlaygroundContext, (x) => x.setSolution);
  const [explorationMode, setExplorationMode] = useState<"bfs" | "dfs">("dfs");
  const handleSolve = useCallback(() => {
    setError(null);
    solveRaw(rawProb.current, explorationMode).then(setSolution).catch(setError);
  }, [setSolution, explorationMode]);

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
                  defaultValue={example2}
                ></textarea>
              </div>
              <Stack spacing={0.5} style={{ flexDirection: "row", justifyContent:"flex-end" }}>
                <select value={explorationMode} onChange={e => setExplorationMode(e.target.value as "bfs" | "dfs")}>
                  <option value="dfs">dfs</option>
                  <option value="bfs">bfs</option>
                </select>
                <button onClick={handleSolve}>Solve</button>
              </Stack>
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
