import { useEffect } from "react"
import { ToolProps } from "./types";
import { getSocket } from "../../lib/socket";

export const useRectangleTool=(
{  canvasRef,
  shapesRef,
  selected,
  RenderShapes,
  roomId,
  panOffSetref,
  zoomRef,
  toWorldCoords
}:ToolProps
)=>{
    useEffect(()=>{
    const canvas= canvasRef.current;
    if(!canvas) return;
    const ctx= canvas.getContext('2d')
    if(!ctx) return;
    const socket=getSocket(Number(roomId))
    if (selected == 'rectangle') {
        let stX = 0, stY = 0;
        let clicked = false;

        const handleMousedown = (e: MouseEvent) => {
            clicked = true;
            const world= toWorldCoords(e.clientX,e.clientY)
            stX = world.x;
            stY = world.y;
        };
        const handleMouseup = (e: MouseEvent) => {
            if (!clicked) return;
            clicked = false;

            const world= toWorldCoords(e.clientX,e.clientY)
            const width = world.x - stX;
            const height = world.y - stY;

            const newShape = { type: "rectangle", x1: stX, y1: stY, width, height };
            shapesRef.current.push({ type: "rectangle", x1: stX, y1: stY, width, height });
            socket.emit('msg', newShape)
        };
        const handleMousemove = (e: MouseEvent) => {
            if (clicked) {
                RenderShapes(shapesRef, panOffSetref, canvasRef,zoomRef)
                const world=toWorldCoords(e.clientX,e.clientY)
                const h = world.y - stY;
                const w = world.x - stX;
                    ctx.save();
                    ctx.translate(panOffSetref.current.x, panOffSetref.current.y);
                    ctx.scale(zoomRef.current, zoomRef.current);
                    ctx.strokeRect(stX, stY, w, h);
                    ctx.restore();

            }
        };

        canvas.addEventListener('mousedown', handleMousedown);
        canvas.addEventListener('mouseup', handleMouseup);
        canvas.addEventListener('mousemove', handleMousemove);
        return () => {
            canvas.removeEventListener("mousedown", handleMousedown);
            canvas.removeEventListener("mouseup", handleMouseup);
            canvas.removeEventListener("mousemove", handleMousemove);
        };
    }        
    },[selected])
}