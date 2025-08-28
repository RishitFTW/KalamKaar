import { useEffect } from "react"
import { ToolProps } from "./types";
import { getSocket } from "../../lib/socket";

export const usePenTool=(
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
     if (selected == 'pen') {
        let currPoints: { x: number, y: number }[] = []; 
        let clicked = false;

        const handleMousedown = (e: MouseEvent) => {
            clicked = true;
            currPoints = [{ x: e.clientX, y: e.clientY }]; 
        };

        const handleMouseup = (e: MouseEvent) => {
            if (!clicked || currPoints.length === 0) {
                clicked = false;
                return;
            }
            clicked = false;

            const worldPoints = currPoints.map(p => toWorldCoords(p.x, p.y));
            
            const newShape = { 
                type: "pen" as const, 
                width: 2, 
                points: worldPoints 
            };

            shapesRef.current.push(newShape);
            socket.emit('msg', newShape);
            currPoints = [];
            RenderShapes(shapesRef, panOffSetref, canvasRef, zoomRef);
        };

        const handleMousemove = (e: MouseEvent) => {
            if (clicked) {
                currPoints.push({ x: e.clientX, y: e.clientY });
                
                RenderShapes(shapesRef, panOffSetref, canvasRef, zoomRef);

                ctx.save();
                ctx.translate(panOffSetref.current.x, panOffSetref.current.y);
                ctx.scale(zoomRef.current, zoomRef.current);

                ctx.lineWidth = 2 / zoomRef.current;
                ctx.lineCap = 'round';
                ctx.strokeStyle = "white"; 
                ctx.beginPath();
                

                const worldPointsPreview = currPoints.map(p => toWorldCoords(p.x, p.y));

                if (worldPointsPreview.length > 1) {
                    let start = worldPointsPreview[0];
                    if(!start){
                        return;
                    }
                    ctx.moveTo(start.x, start.y);
                    for (let i = 1; i < worldPointsPreview.length; i++) {
                        const pt = worldPointsPreview[i];
                        if(pt){
                          ctx.lineTo(pt.x, pt.y);
                        }
                    }
                }
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