import { useEffect } from "react"
import { ToolProps } from "./types";
import { getSocket } from "../../lib/socket";

export const useEllipseTool=(
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
    const socket= getSocket(Number(roomId))
     if (selected == 'ellipse') {
        let stX = 0, stY = 0;
        let clicked = false;

        const handleMousedown = (e: MouseEvent) => {
            clicked = true;
            const world = toWorldCoords(e.clientX, e.clientY);
            stX = world.x;
            stY = world.y;
        };

        const handleMouseup = (e: MouseEvent) => {
            if (!clicked) return;
            clicked = false;
            
            const world = toWorldCoords(e.clientX, e.clientY);
            const w = world.x - stX;
            const h = world.y - stY;

            const worldCenterX = stX + w / 2;
            const worldCenterY = stY + h / 2;
            const rx = Math.abs(w) / 2;
            const ry = Math.abs(h) / 2;

            const newShape = {
                type: "ellipse",
                x1: worldCenterX,
                y1: worldCenterY,
                x2: rx,
                y2: ry
            };
            
            shapesRef.current.push({
                type: "ellipse",
                x1: worldCenterX,
                y1: worldCenterY,
                x2: rx,
                y2: ry
            });
            socket.emit('msg', newShape);
            RenderShapes(shapesRef, panOffSetref, canvasRef, zoomRef);
        };

        const handleMousemove = (e: MouseEvent) => {
            if (clicked) {
                RenderShapes(shapesRef, panOffSetref, canvasRef, zoomRef);
                
                const world = toWorldCoords(e.clientX, e.clientY);
                const w = world.x - stX;
                const h = world.y - stY;

                const worldCenterX = stX + w / 2;
                const worldCenterY = stY + h / 2;
                const rx = Math.abs(w) / 2;
                const ry = Math.abs(h) / 2;
                
                ctx.save();
                ctx.translate(panOffSetref.current.x, panOffSetref.current.y);
                ctx.scale(zoomRef.current, zoomRef.current);
                ctx.beginPath();
                ctx.ellipse(worldCenterX, worldCenterY, rx, ry, 0, 0, 2 * Math.PI);
                ctx.stroke();
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