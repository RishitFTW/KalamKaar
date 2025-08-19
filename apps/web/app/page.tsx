"use client"
import { useEffect, useRef, useState } from "react";

interface Rectangle {
  type: "rectangle";
  startingX: number;
  startingY: number;
  width: number;
  height: number;
}

interface Line{
  type:"line"
  startingX:number,
  startingY:number,
  endingX:number,
  endingY:number,
}

interface Ellipse {
  type: "ellipse";
  centerX: number;
  centerY: number;
  radiusX: number;
  radiusY: number;
}

type Shape= Rectangle | Ellipse | Line

export default function Home() {
  const canvasRef= useRef<HTMLCanvasElement>(null);
  const shapesRef = useRef<Shape[]>([]);
  const [selected,setSelected]=useState('circle')

  
  useEffect(()=>{

    const canvas= canvasRef.current;

    if (!canvas) return;

    canvas.width=window.innerWidth;
    canvas.height=window.innerHeight
    const ctx= canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.strokeStyle="white"

    const renderShapes=()=>{
      ctx.clearRect(0,0,canvas.width,canvas.height)
        for(const shape of shapesRef.current){
          if(shape.type=="rectangle"){
            ctx.strokeRect(shape.startingX, shape.startingY, shape.width, shape.height);
          }
          else if(shape.type=="ellipse"){
            ctx.beginPath()
            ctx.ellipse(shape.centerX, shape.centerY, shape.radiusX, shape.radiusY,0,0,2*Math.PI);
            ctx.stroke()
          }
          else if(shape.type=='line'){
            ctx.beginPath(); 
            ctx.moveTo(shape.startingX, shape.startingY); 
            ctx.lineTo(shape.endingX, shape.endingY); 
            ctx.stroke();        
          }
          
        }
    }
    renderShapes()
   if(selected=='rectangle'){
      let stX=0,stY=0
      let clicked=false;

      const handleMousedown=(e:MouseEvent)=>{
            clicked=true
            stX=e.clientX
            stY=e.clientY
      }
      const handleMouseup=(e:MouseEvent)=>{
            clicked=false
            shapesRef.current.push({type:"rectangle",startingX:stX,startingY:stY,width:e.clientX-stX, height:e.clientY-stY})
      }
      const handleMousemove=(e:MouseEvent)=>{
        if(clicked){
          renderShapes()       
          const h=e.clientY-stY;
          const w=e.clientX-stX
          ctx.strokeRect(stX,stY,w,h);
        }
      }

      canvas.addEventListener('mousedown',handleMousedown)
      canvas.addEventListener('mouseup',handleMouseup)
      canvas.addEventListener('mousemove',handleMousemove)
      return ()=>{
        canvas.removeEventListener("mousedown", handleMousedown);
        canvas.removeEventListener("mouseup", handleMouseup);
        canvas.removeEventListener("mousemove", handleMousemove);
      }
   }

   else if(selected=='ellipse'){
   
    let stX=0,stY=0;
    let clicked=false;
    const handleMousedown=(e:MouseEvent)=>{
      clicked=true;
       stX=e.clientX;
       stY=e.clientY;
    }
    const handleMouseup=(e:MouseEvent)=>{
      clicked=false
          let w = e.clientX - stX;
          let h = e.clientY - stY;
          let x = stX + w / 2;
          let y = stY + h / 2;
          let rx = Math.abs(w) / 2;
          let ry = Math.abs(h) / 2;      
      shapesRef.current.push({  type: "ellipse",
                                  centerX: x,
                                  centerY: y,
                                  radiusX: rx,
                                  radiusY: ry})
                             
    }
    const handleMousemove=(e:MouseEvent)=>{
      if(clicked){
        renderShapes();
        let w = e.clientX - stX;
        let h = e.clientY - stY;
        let x = stX + w / 2;
        let y = stY + h / 2;
        let rx = Math.abs(w) / 2;
        let ry = Math.abs(h) / 2;
        ctx.beginPath();
        ctx.ellipse(x, y, rx, ry, 0, 0, 2 * Math.PI);
        ctx.stroke();
      }
    }
    canvas.addEventListener('mousedown',handleMousedown)
    canvas.addEventListener('mouseup',handleMouseup)
    canvas.addEventListener('mousemove',handleMousemove)

      return()=>{  
        canvas.removeEventListener("mousedown", handleMousedown);
        canvas.removeEventListener("mouseup", handleMouseup);
        canvas.removeEventListener("mousemove", handleMousemove);
      }
   }
   else if(selected=="line"){

    let startX=0,startY=0;
    let clicked=false
    const handleMousedown=(e:MouseEvent)=>{
      clicked=true;
      startX=e.clientX;
      startY=e.clientY;
    }
    const handleMouseup=(e:MouseEvent)=>{
      clicked=false;
      shapesRef.current.push({
                         type:"line",
                        startingX:startX,
                        startingY:startY,
                        endingX:e.clientX,
                        endingY:e.clientY,
      })
    }
    const handleMousemove=(e:MouseEvent)=>{
      if(clicked){
        renderShapes()
        ctx.beginPath(); 
        ctx.moveTo(startX, startY); 
        ctx.lineTo(e.clientX, e.clientY);
        ctx.stroke();      
      }
    }
    canvas.addEventListener('mousedown',handleMousedown)
    canvas.addEventListener('mouseup',handleMouseup)
    canvas.addEventListener('mousemove',handleMousemove)

      return()=>{  
        canvas.removeEventListener("mousedown", handleMousedown);
        canvas.removeEventListener("mouseup", handleMouseup);
        canvas.removeEventListener("mousemove", handleMousemove);
      }    
   }

  },[selected])
  
  const handleClear=()=>{
    const canvas= canvasRef.current;
    if(!canvas) return;
    const ctx= canvas.getContext('2d');
    if(ctx){
       shapesRef.current=[]
       ctx.clearRect(0, 0, canvas.width, canvas.height); 
    }
  }

  return (
    <div className="w-screen h-screen bg-gray-300">
         <canvas ref={canvasRef} className="h-full w-full bg-[#121212] relative">
         </canvas>
         <div className="absolute top-4 left-4 flex flex-col gap-1">
            <button onClick={()=>{setSelected("rectangle")}} className="bg-white text-black p-1 rounded-md">rectangle</button>
            <button onClick={()=>{setSelected("ellipse")}} className="bg-white text-black rounded-md">circle</button>
            <button onClick={()=>{setSelected("line")}} className="bg-white text-black rounded-md">line</button>
            <button onClick={handleClear} className="bg-red-500 text-black rounded-md">clear</button>
         </div>
         
    </div>
  );
}
