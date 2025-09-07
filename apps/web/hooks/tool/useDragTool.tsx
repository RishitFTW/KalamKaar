import { useEffect } from "react"
import { ToolProps } from "./types"
import { getSocket } from "../../lib/socket";
import { start } from "repl";

export const useDragTool=(
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
    if(selected=="drag"){

      let currShape=null;
      let stX,stY,dragging=false;
      const handleSelect=(e:MouseEvent)=>{
        const x= e.clientX;
        const y=e.clientY;
        const world=toWorldCoords(x,y);
        currShape = null;
        for(let i=0; i<shapesRef.current.length; i++){
          let shape=shapesRef.current[i];
          if(shape.type=="rectangle"){
              let start={x:shape.x1,y:shape.y1}
              let end={x:start.x+shape.width,y:start.y+shape.height};
              let x=Math.min(start.x,end.x);
              let y=Math.min(start.y,end.y);
              if(x<=world.x && y<=world.y && world.x<= x+shape.width && world.y<=y+shape.height){
                   currShape=shape;
              }
              
          }
          else if(shape.type=="ellipse"){
             let x=Math.min(shape.x1,shape.x2)
             let y= Math.min(shape.y1,shape.y2);
             let endx=Math.max(shape.x1,shape.x2)
             let endy=Math.max(shape.y1,shape.y2)
              if(x<=world.x && y<=world.y && world.x<= endx && world.y<=endy){
                   currShape=shape;
              }             
          }
          else if(shape.type=="icon"){

          }
          else if(shape.type=="Text"){
             let x=Math.min(shape.x1,shape.x2)
             let y= Math.min(shape.y1,shape.y2);
             let endx=Math.max(shape.x1,shape.x2)
             let endy=Math.max(shape.y1,shape.y2)
              if(x<=world.x && y<=world.y && world.x<= endx && world.y<=endy){
                   currShape=shape;
              }  
          }
          else if(shape.type=="line"){
             let x=Math.min(shape.x1,shape.x2)
             let y= Math.min(shape.y1,shape.y2);
             let endx=Math.max(shape.x1,shape.x2)
             let endy=Math.max(shape.y1,shape.y2)
              if(x<=world.x && y<=world.y && world.x<= endx && world.y<=endy){
                   currShape=shape;
              } 
          }
          else if(shape.type=="pen"){

          }
        }

      }

      const handleMouseDown=(e:MouseEvent)=>{
          if(!currShape) return;
          dragging=true;
          stX=e.clientX;
          stY=e.clientY;
      }
      const handleMouseUp=(e:MouseEvent)=>{
        dragging=false;
        RenderShapes(shapesRef, panOffSetref, canvasRef, zoomRef);
      }
      const handleMouseMove=(e:MouseEvent)=>{
        if(dragging){

          if(currShape.type=="rectangle"){
            let endX=e.clientX
            let endY=e.clientY;
            let final={x:endX-stX,y:endY-stY};
            stX=endX;
            stY=endY;
            currShape.x1+=final.x
            currShape.y1+=final.y;
            RenderShapes(shapesRef, panOffSetref, canvasRef, zoomRef);
          }
          else if(currShape.type=="ellipse"){
          let endX=e.clientX
          let endY=e.clientY;
          let final={x:endX-stX,y:endY-stY};
          stX=endX;
          stY=endY;
          currShape.x1+=final.x
          currShape.y1+=final.y;
          currShape.x2+=final.x;
          currShape.y2+=final.y;
          RenderShapes(shapesRef, panOffSetref, canvasRef, zoomRef);
          }
          else if(currShape.type=="line"){
          let endX=e.clientX
          let endY=e.clientY;
          let final={x:endX-stX,y:endY-stY};
          stX=endX;
          stY=endY;
          currShape.x1+=final.x
          currShape.y1+=final.y;
          currShape.x2+=final.x;
          currShape.y2+=final.y;
          RenderShapes(shapesRef, panOffSetref, canvasRef, zoomRef);            
          }
          else if(currShape.type=="Text"){
          let endX=e.clientX
          let endY=e.clientY;
          let final={x:endX-stX,y:endY-stY};
          stX=endX;
          stY=endY;
          currShape.x1+=final.x
          currShape.y1+=final.y;
          currShape.x2+=final.x;
          currShape.y2+=final.y;
          RenderShapes(shapesRef, panOffSetref, canvasRef, zoomRef);    
          }
        }
        
      }


      canvas.addEventListener('mousedown',handleMouseDown)
      canvas.addEventListener('mouseup',handleMouseUp)
      canvas.addEventListener('mousemove',handleMouseMove);
      canvas.addEventListener('click',handleSelect)
      return ()=>{
        canvas.removeEventListener('click',handleSelect)
        canvas.removeEventListener('mousedown',handleMouseDown)
        canvas.removeEventListener('mouseup',handleMouseUp)
        canvas.removeEventListener('mousemove',handleMouseMove);        
      }
    }
    
    },[selected])
}