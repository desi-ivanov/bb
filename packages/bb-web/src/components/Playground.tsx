import React, { useCallback, useRef } from "react";
import { BBSolution } from "bb/dist/BranchAndBound";
import { precompute } from "./utils";
import { RenderPrecomputedNode } from "./RenderPrecomputedNode";

const YSpacing = 150;
const XSpacing = 100;

export const Playground: React.FC<{ solution: BBSolution }> = ({ solution }) => {
  const rootDivRef = useRef<HTMLDivElement | null>(null);
  const mouseState = useRef<{
    mouseDown: boolean;
    lastPos: null | { x: number; y: number };
  }>({ mouseDown: false, lastPos: null });
  const precomputed = precompute(solution, XSpacing, YSpacing);

  const handleMouseMove: React.MouseEventHandler<HTMLDivElement> = useCallback(
    (e) => {
      if(
        rootDivRef.current &&
        mouseState.current.mouseDown &&
        mouseState.current.lastPos
      ) {
        const dx = e.clientX - mouseState.current.lastPos.x;
        const dy = e.clientY - mouseState.current.lastPos.y;

        // Scroll the element
        rootDivRef.current.scrollTop -= dy;
        rootDivRef.current.scrollLeft -= dx;
      }
      mouseState.current.lastPos = { x: e.clientX, y: e.clientY };
    },
    []
  );

  const handleMouseUp = useCallback(() => {
    mouseState.current.mouseDown = false;
    if(rootDivRef.current) {
      rootDivRef.current.style.cursor = "default";
    }
  }, []);

  const handleMouseDown: React.MouseEventHandler<HTMLDivElement> = useCallback(
    (e) => {
      mouseState.current.mouseDown = true;
      mouseState.current.lastPos = { x: e.clientX, y: e.clientY };
      if(rootDivRef.current) {
        rootDivRef.current.style.cursor = "grab";
      }
    },
    []
  );
  return (
    <div
      ref={rootDivRef}
      style={{ overflow: "scroll scroll", flex: 1, backgroundColor: "#ccc" }}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseUp}
    >
      <svg
        viewBox="-100 -400 10000 10000"
        width={10000}
        height={10000}
        xmlns="http://www.w3.org/2000/svg"
      >
        <RenderPrecomputedNode node={precomputed} />
      </svg>
    </div>
  );
};