import { drawRoundedDiamond } from "./DiamondShape";
import { Shape } from "../app/types/Shape";

export function RenderShapes(
  shapesRef: React.MutableRefObject<Shape[]>,
  panOffSetref: React.MutableRefObject<{ x: number; y: number }>,
  canvasRef: React.RefObject<HTMLCanvasElement | null>){
  const canvas = canvasRef.current;
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;
      ctx.clearRect(0,0,canvas.width,canvas.height);
      ctx.save()
      ctx.translate(panOffSetref.current.x,panOffSetref.current.y)
      for(const shape of shapesRef.current){
        if(shape.type=="rectangle"){
          ctx.strokeRect(shape.x1, shape.y1, shape.width, shape.height);
          console.log(`x1->${shape.x1} y->${shape.y1} width->${shape.width} height->${shape.height}`)
          console.log(`PanX1>${panOffSetref.current.x} PanY->${panOffSetref.current.y}`)
        }
        else if(shape.type=="ellipse"){
          ctx.beginPath();
          ctx.ellipse(shape.x1, shape.y1, shape.x2, shape.y2,0,0,2*Math.PI);
          ctx.stroke();
        }
        else if(shape.type=='line'){
          ctx.beginPath(); 
          ctx.moveTo(shape.x1, shape.y1); 
          ctx.lineTo(shape.x2, shape.y2); 
          ctx.stroke();        
        }
        else if(shape.type=='icon'){
          drawRoundedDiamond(ctx, shape.x1, shape.y1, shape.width, shape.height, shape.radius);
        }
        else if(shape.type=='pen'){
          ctx.lineWidth=2;
          ctx.lineCap='round';
          ctx.beginPath();
          if(shape.points.length>1){
            const starting= shape.points[0];
            if(starting){
              ctx.moveTo(starting.x,starting.y);
              for(let i=1; i<shape.points.length; i++){
                let pt=shape.points[i];
                if(pt){
                  ctx.lineTo(pt.x,pt.y);
                }
              }
            }
          }
          ctx.stroke();
        }
      }
      ctx.restore();    
}