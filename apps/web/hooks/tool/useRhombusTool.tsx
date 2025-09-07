import { useEffect } from "react"
import { ToolProps } from "./types";
import { drawRoundedDiamond } from "../../lib/DiamondShape";
import { getSocket } from "../../lib/socket";

export const useRhombusTool=(
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
}:ToolProps  
)=>{
   useEffect(()=>{

    const canvas= canvasRef.current;
    if(!canvas) return;
    const ctx= canvas.getContext('2d')
    if(!ctx) return;  
    const socket=getSocket(Number(roomId))
     if (selected === "icon") {
        let stX = 0, stY = 0;
        let clicked = false;

        const handleMousedown = (e: MouseEvent) => {
            clicked = true;
            stX = e.clientX;
            stY = e.clientY;
        };

        const handleMouseup = (e: MouseEvent) => {
            if (!clicked) return;
            clicked = false;
            
            const w = e.clientX - stX;
            const h = e.clientY - stY;
            const screenCx = stX + w / 2;
            const screenCy = stY + h / 2;

            const world = toWorldCoords(screenCx, screenCy);
            
            const worldWidth = Math.abs(w) / zoomRef.current;
            const worldHeight = Math.abs(h) / zoomRef.current;
            const start=toWorldCoords(stX,stY);
            const end=toWorldCoords(e.clientX,e.clientY)
            const newShape = {
                id:user,
                type: "icon" as const,
                x1: world.x,
                y1: world.y,
                width: worldWidth,
                height: worldHeight,
                radius: 20,
            };
            
            shapesRef.current.push({
                id:user,
                type: "icon" as const,
                x1: world.x,
                y1: world.y,
                width: worldWidth,
                height: worldHeight,
                radius: 20,
            });
            undoRef.current.push({
                id:user,
                type: "icon" as const,
                x1: world.x,
                y1: world.y,
                width: worldWidth,
                height: worldHeight,
                radius: 20,
            });
            socket.emit('msg', newShape);
            RenderShapes(shapesRef, panOffSetref, canvasRef, zoomRef);
        };

        const handleMousemove = (e: MouseEvent) => {
            if (clicked) {
                RenderShapes(shapesRef, panOffSetref, canvasRef, zoomRef);

                const w = e.clientX - stX;
                const h = e.clientY - stY;
                const screenCx = stX + w / 2;
                const screenCy = stY + h / 2;
                
                const worldCenter = toWorldCoords(screenCx, screenCy);
                const worldWidth = Math.abs(w) / zoomRef.current;
                const worldHeight = Math.abs(h) / zoomRef.current;
                
                ctx.save();
                ctx.translate(panOffSetref.current.x, panOffSetref.current.y);
                ctx.scale(zoomRef.current, zoomRef.current);

                drawRoundedDiamond(ctx, worldCenter.x, worldCenter.y, worldWidth, worldHeight, 20);
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
   },[selected]) 
}