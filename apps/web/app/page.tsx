"use client"
import { useEffect, useRef } from "react";

interface Shape{
  "startingX":number,
  "startingY":number,
  "width":number,
  "height":number
}

export default function Home() {
  const canvasRef= useRef<HTMLCanvasElement>(null);
  const shapesRef = useRef<Shape[]>([]);
  useEffect(()=>{

    const canvas= canvasRef.current;

    if (!canvas) return;

    canvas.width=window.innerWidth;
    canvas.height=window.innerHeight
    const ctx= canvas.getContext('2d');
    if (!ctx) return;
    
    for(const shape of shapesRef.current){
      ctx.strokeRect(shape.startingX, shape.startingY, shape.width, shape.height);
    }

    ctx.strokeStyle="white"
    let stX=0,stY=0
    let clicked=false

    canvas.addEventListener('mousedown',(e)=>{
      clicked=true
      stX=e.clientX
      stY=e.clientY
      console.log(e.clientX);
      console.log(e.clientY)
    })
    
    canvas.addEventListener('mouseup',(e)=>{
      clicked=false
      shapesRef.current.push({startingX:stX,startingY:stY,width:e.clientX, height:e.clientY})
    })
    
    canvas.addEventListener('mousemove',(e)=>{
      if(clicked){
        const h=e.clientY-stY;
        const w=e.clientX-stX
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeRect(stX,stY,w,h);
      }

    })

  },[canvasRef])


  return (
    <div className="w-screen h-screen bg-gray-300">
         <canvas ref={canvasRef} className="h-full w-full bg-black">
         </canvas>
    </div>
  );
}
