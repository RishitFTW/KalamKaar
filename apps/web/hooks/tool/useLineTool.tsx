import { useEffect } from "react"
import { ToolProps } from "./types";
import { getSocket } from "../../lib/socket";

export const useLineTool = (
{  
  user,
  undoRef, 
  canvasRef,
  shapesRef,
  selected,
  RenderShapes,
  roomId,
  panOffSetref,
  zoomRef,
  toWorldCoords
}: ToolProps
) => {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const socket = getSocket(Number(roomId));

    if (selected == "line") {
      let startX = 0,
        startY = 0;
      let clicked = false;

      const handleMousedown = (e: MouseEvent) => {
        clicked = true;
        startX = e.clientX;
        startY = e.clientY;
      };

      const handleMouseup = (e: MouseEvent) => {
        if (!clicked) return;
        clicked = false;

        const world1 = toWorldCoords(startX, startY);
        const world2 = toWorldCoords(e.clientX, e.clientY);


        shapesRef.current.push({
          id: user,
          type: "line" as const,
          x1: world1.x,
          y1: world1.y,
          x2: world2.x,
          y2: world2.y,
        });
        undoRef.current.push({
          id: user,
          type: "line" as const,
          x1: world1.x,
          y1: world1.y,
          x2: world2.x,
          y2: world2.y,
        });
        socket.emit("msg", {
          id: user,
          type: "line" as const,
          x1: world1.x,
          y1: world1.y,
          x2: world2.x,
          y2: world2.y,
        });
        RenderShapes(shapesRef, panOffSetref, canvasRef, zoomRef);
      };

      const handleMousemove = (e: MouseEvent) => {
        if (clicked) {
          RenderShapes(shapesRef, panOffSetref, canvasRef, zoomRef);
          ctx.save();

          ctx.beginPath();
          ctx.moveTo(startX, startY);
          ctx.lineTo(e.clientX, e.clientY);
          ctx.stroke();

          const headlen = 10; 
          const angle = Math.atan2(
            e.clientY - startY,
            e.clientX - startX
          );

          ctx.beginPath();
          ctx.moveTo(e.clientX, e.clientY);
          ctx.lineTo(
            e.clientX - headlen * Math.cos(angle - Math.PI / 6),
            e.clientY - headlen * Math.sin(angle - Math.PI / 6)
          );
          ctx.moveTo(e.clientX, e.clientY);
          ctx.lineTo(
            e.clientX - headlen * Math.cos(angle + Math.PI / 6),
            e.clientY - headlen * Math.sin(angle + Math.PI / 6)
          );
          ctx.stroke();

          ctx.restore();
        }
      };

      canvas.addEventListener("mousedown", handleMousedown);
      canvas.addEventListener("mouseup", handleMouseup);
      canvas.addEventListener("mousemove", handleMousemove);

      return () => {
        canvas.removeEventListener("mousedown", handleMousedown);
        canvas.removeEventListener("mouseup", handleMouseup);
        canvas.removeEventListener("mousemove", handleMousemove);
      };
    }
  }, [selected]);
};
