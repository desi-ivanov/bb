import { BBNode } from "bb/dist/BranchAndBound";
import React, { useCallback, useRef, useState } from "react";
import { SVGNode } from "./SVGNode";
import { depth } from "./utils";

export const Playground: React.FC<{ root: BBNode }> = React.memo(({ root }) => {
  const [zoom, setZoom] = useState(1)
  const rootDivRef = useRef<HTMLDivElement | null>(null);
  const mouseState = useRef<{
    mouseDown: boolean;
    lastPos: null | { x: number; y: number };
  }>({ mouseDown: false, lastPos: null });

  const handleMouseMove: React.MouseEventHandler<HTMLDivElement> = useCallback(
    (e) => {
      if(
        rootDivRef.current &&
        mouseState.current.mouseDown &&
        mouseState.current.lastPos
      ) {
        const dx = e.clientX - mouseState.current.lastPos.x;
        const dy = e.clientY - mouseState.current.lastPos.y;
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

  const d = depth(root);
  const ySpacing = 150;
  const xSpacing = 150;
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: 'column'
      }}
    >
      <input type="range" min={0.1} max={2} step={0.01} onChange={e => setZoom(Number(e.target.value))} style={{ margin: 16, width: 200 }} />
      <div
        ref={rootDivRef}
        style={{
          overflow: "hidden",
          flex: 1,
        }}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseUp}
      >
        <svg
          viewBox={`-75 -75 10000 10000`}
          width={10000}
          height={10000}
          style={{ position: "relative" }}
          xmlns="http://www.w3.org/2000/svg"
        >
          <SVGNode
            node={root}
            startX={0}
            startY={0}
            ySpacing={ySpacing}
            dedicatedWidth={xSpacing * (2 ** (d - 1))}
            zoom={zoom}
          />
        </svg>
      </div>
    </div>
  );
});
