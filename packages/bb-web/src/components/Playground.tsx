import React, { useCallback, useRef } from "react";
import { RenderPrecomputedNode } from "./RenderPrecomputedNode";
import { PrecomputedNode } from "./utils";


export const Playground: React.FC<{ root: PrecomputedNode }> = React.memo(
  ({ root }) => {
    const rootDivRef = useRef<HTMLDivElement | null>(null);

    const mouseState = useRef<{
      mouseDown: boolean;
      lastPos: null | { x: number; y: number };
    }>({ mouseDown: false, lastPos: null });

    const handleMouseMove: React.MouseEventHandler<HTMLDivElement> =
      useCallback((e) => {
        if (
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
      }, []);

    const handleMouseUp = useCallback(() => {
      mouseState.current.mouseDown = false;
      if (rootDivRef.current) {
        rootDivRef.current.style.cursor = "default";
      }
    }, []);

    const handleMouseDown: React.MouseEventHandler<HTMLDivElement> =
      useCallback((e) => {
        mouseState.current.mouseDown = true;
        mouseState.current.lastPos = { x: e.clientX, y: e.clientY };
        if (rootDivRef.current) {
          rootDivRef.current.style.cursor = "grab";
        }
      }, []);
    return (
      <div
        ref={rootDivRef}
        style={{
          overflow: "scroll scroll",
          flex: 1,
        }}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseUp}
      >
        <svg
          viewBox="-50 -50 10000 10000"
          width={10000}
          height={10000}
          style={{position: "relative"}}
          xmlns="http://www.w3.org/2000/svg"
        >
          <RenderPrecomputedNode node={root} />
        </svg>
      </div>
    );
  }
);
