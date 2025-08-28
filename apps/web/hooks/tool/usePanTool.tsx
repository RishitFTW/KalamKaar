import { useEffect } from "react"
import { ToolProps } from "./types";
import { getSocket } from "../../lib/socket";

export const usePanTool=(
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
     if (selected == 'handgrip') {
        RenderShapes(shapesRef, panOffSetref, canvasRef, zoomRef)
        let isPanning = false;
        let panStart = { x: 0, y: 0 };
        let currPan = { x: panOffSetref.current.x, y: panOffSetref.current.y }
        const handleMouseDown = (e: MouseEvent) => {
            if (e.button !== 0) return;
            isPanning = true;
            panStart = {
                x: e.clientX,
                y: e.clientY,
            };
            currPan = { x: panOffSetref.current.x, y: panOffSetref.current.y }

        };

        const handleMouseUp = () => {
            isPanning = false;
        };

        const handleMouseMove = (e: MouseEvent) => {
            if (isPanning) {
                const newOffset = {
                    x: e.clientX - panStart.x,
                    y: e.clientY - panStart.y,
                };
                const newOffset1 = {
                    x: newOffset.x + currPan.x,
                    y: newOffset.y + currPan.y
                }
                panOffSetref.current = newOffset1;

                RenderShapes(shapesRef, panOffSetref, canvasRef, zoomRef)
            }
        };

        canvas.addEventListener("mousedown", handleMouseDown);
        window.addEventListener("mouseup", handleMouseUp);
        window.addEventListener("mousemove", handleMouseMove);

        return () => {
            canvas.removeEventListener("mousedown", handleMouseDown);
            window.removeEventListener("mouseup", handleMouseUp);
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }    
  },[selected])    
}