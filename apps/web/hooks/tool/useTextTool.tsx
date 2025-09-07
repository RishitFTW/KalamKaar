import { useEffect } from "react"
import { ToolProps } from "./types"
import { getSocket } from "../../lib/socket";

export const useTextTool=(
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
    const ctx=canvas.getContext("2d");
    if(!ctx) return;
    const socket= getSocket(Number(roomId))

    if(selected=="Text"){

        let stX,stY;
        let area: HTMLTextAreaElement | null = null;
       const handleDoubleClick=(e)=>{
         stX= e.clientX;
         stY= e.clientY;
         createInputText(stX,stY)
       }

       const createInputText=(x,y)=>{
         area= document.createElement("textarea")
        area.style.position = "absolute";
        area.style.left = `${x}px`;
        area.style.top = `${y}px`;
        area.style.font = "20px sans-serif";
        area.style.background = "none";
        area.style.border = "none";
        area.style.outline = "none";
        area.style.color = "white";
        area.style.resize = "none";
        area.style.overflow = "hidden";
        area.style.padding = "0";
        area.style.margin = "0";
        document.body.appendChild(area);
        area.focus();
        
         const widthInc=()=>{
            const span = document.createElement("span");
            span.style.font = area.style.font;
            span.style.visibility = "hidden";
            span.style.whiteSpace = "pre";
            span.textContent = area.value || " ";
            document.body.appendChild(span);
            area.style.width = span.offsetWidth + 5 + "px"; 
            document.body.removeChild(span);            
        }
        area.addEventListener("input",widthInc);
        const handleOutClick=(e:MouseEvent)=>{
          
          if (e.target !== area) {
                if (area && area.value.trim() !== "") {
                const world = toWorldCoords(stX, stY);

                const span = document.createElement("span");
                span.style.font = area.style.font;
                span.style.visibility = "hidden";
                span.style.whiteSpace = "pre";
                span.textContent = area.value || " ";
                document.body.appendChild(span);

                const textWidth = span.offsetWidth;
                const textHeight = span.offsetHeight;

                document.body.removeChild(span);

                const endScreen = { x: stX + textWidth, y: stY + textHeight };
                const worldEnd = toWorldCoords(endScreen.x, endScreen.y);
                shapesRef.current.push({
                    id: user,
                    type: "Text",
                    x1: world.x,
                    y1: world.y,
                    x2:worldEnd.x,
                    y2:worldEnd.y,
                    points: {text:area.value}
                });
                undoRef.current.push({
                    id: user,
                    type: "Text",
                    x1: world.x,
                    y1: world.y,
                    x2:worldEnd.x,
                    y2:worldEnd.y,
                    points: {text:area.value}
                });
                socket.emit("msg", {
                    id: user,
                    type: "Text",
                    x1: world.x,
                    y1: world.y,
                    x2:worldEnd.x,
                    y2:worldEnd.y,
                    points: {text:area.value}
                });              
                RenderShapes(shapesRef, panOffSetref, canvasRef, zoomRef);
                }
                if (area) {
                    document.body.removeChild(area);
                    area = null;
                }
            window.removeEventListener("click", handleOutClick);
          }            
        }
        window.addEventListener("click",handleOutClick)
       }

       canvas.addEventListener("dblclick",handleDoubleClick)
       
       return ()=>{
        canvas.removeEventListener("dblclick",handleDoubleClick);
       }
    }
    
    },[selected])
}