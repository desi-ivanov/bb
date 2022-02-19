import { BBNode } from "@bb/core/dist/BranchAndBound";
import React, { useCallback, useRef, useState } from "react";
import { SVGNode } from "./SVGNode";
import { depth } from "./utils";

export const Playground: React.FC<{ root: BBNode }> = React.memo(({ root }) => {
  const [xSpacingMultiplier, setXSpacingMultiplier] = useState(1);
  const rootDivRef = useRef<HTMLDivElement | null>(null);
  const mouseState = useRef<{ mouseDown: boolean; lastPos: null | { x: number; y: number } }>({ mouseDown: false, lastPos: null });
  const [t, setT] = useState({ x: 0, y: 0 });
  const [z, setZ] = useState(1);

  const handleMouseMove: React.MouseEventHandler<HTMLDivElement> = useCallback((e) => {
    if (rootDivRef.current && mouseState.current.mouseDown && mouseState.current.lastPos) {
      const dx = e.clientX - mouseState.current.lastPos.x;
      const dy = e.clientY - mouseState.current.lastPos.y;
      setT((pt) => ({ x: pt.x + dx, y: pt.y + dy }));
    }
    mouseState.current.lastPos = { x: e.clientX, y: e.clientY };
  }, []);

  const handleMouseUp = useCallback(() => {
    mouseState.current.mouseDown = false;
    if (rootDivRef.current) {
      rootDivRef.current.style.cursor = "default";
    }
  }, []);

  const handleMouseDown: React.MouseEventHandler<HTMLDivElement> = useCallback((e) => {
    mouseState.current.mouseDown = true;
    mouseState.current.lastPos = { x: e.clientX, y: e.clientY };
    if (rootDivRef.current) {
      rootDivRef.current.style.cursor = "grab";
    }
  }, []);

  const handleWheel: React.WheelEventHandler<HTMLDivElement> = useCallback((e) => setZ((pz) => pz - Math.sign(e.deltaY) * 0.1), []);

  const d = depth(root);
  const ySpacing = 150;
  const xSpacing = 110 * xSpacingMultiplier;
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <input type="range" min={0.1} max={2} step={0.01} onChange={(e) => setXSpacingMultiplier(Number(e.target.value))} style={{ margin: 16, width: 200 }} />
      <div
        ref={rootDivRef}
        style={{ overflow: "hidden", flex: 1 }}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      >
        <svg viewBox={`-75 -75 10000 10000`} width={10000} height={10000} style={{ position: "relative", transform: `translate(${t.x}px,${t.y}px )` }} xmlns="http://www.w3.org/2000/svg">
          <SVGNode node={root} startX={0} startY={0} ySpacing={ySpacing} dedicatedWidth={xSpacing * 2 ** (d - 1)} zoom={z} />
        </svg>
      </div>
    </div>
  );
});
