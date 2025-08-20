"use client"

import { StringXor } from "next/dist/compiled/webpack/webpack";
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

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

interface Icon {
  type: "icon";
  centerX: number;
  centerY: number;
  width: number;
  height: number;
  radius: number; // corner roundness
}

interface Pen{
  type:"pen";
  lineWidth:number;
  points:{x:number,y:number}[]
}

type Shape = Rectangle | Ellipse | Line | Icon | Pen;

export default function Home() {
  const canvasRef= useRef<HTMLCanvasElement>(null);
  const shapesRef = useRef<Shape[]>([]);
  const [selected,setSelected]=useState('circle')

  useEffect(()=>{
    const socket=io("http://localhost:4000",{
      query:{
        roomId:1
      }
    })
    socket.on("connect", () => {
      console.log("Connected to server:", socket.id);
    });
  },[])

  useEffect(()=>{

    const canvas= canvasRef.current;
    if (!canvas) return;

    canvas.width=window.innerWidth;
    canvas.height=window.innerHeight;
    const ctx= canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.strokeStyle="white";

    // draw rounded diamond helper
function drawRoundedDiamond(ctx:CanvasRenderingContext2D, x:number, y:number, w:number, h:number, r:number){
  if (w < 2 * r) r = w / 2;
  if (h < 2 * r) r = h / 2;

  const hw = w / 2; // half-width
  const hh = h / 2; // half-height

  // The four vertices of the diamond
  const top = { x: x, y: y - hh };
  const right = { x: x + hw, y: y };
  const bottom = { x: x, y: y + hh };
  const left = { x: x - hw, y: y };

  // Calculate the length of the diamond's edges to properly scale the radius
  const edgeLength = Math.sqrt(hw * hw + hh * hh);
  const radius = Math.min(r, edgeLength / 2);
  const ratio = radius / edgeLength;

  // Calculate the 8 points where the straight edges meet the corner curves
  const p1 = { x: top.x + hw * ratio, y: top.y + hh * ratio };
  const p2 = { x: right.x - hw * ratio, y: right.y - hh * ratio };
  const p3 = { x: right.x - hw * ratio, y: right.y + hh * ratio };
  const p4 = { x: bottom.x + hw * ratio, y: bottom.y - hh * ratio };
  const p5 = { x: bottom.x - hw * ratio, y: bottom.y - hh * ratio };
  const p6 = { x: left.x + hw * ratio, y: left.y + hh * ratio };
  const p7 = { x: left.x + hw * ratio, y: left.y - hh * ratio };
  const p8 = { x: top.x - hw * ratio, y: top.y + hh * ratio };

  // Draw the shape by connecting the points
  ctx.beginPath();
  ctx.moveTo(p1.x, p1.y);
  ctx.lineTo(p2.x, p2.y);
  ctx.quadraticCurveTo(right.x, right.y, p3.x, p3.y);
  ctx.lineTo(p4.x, p4.y);
  ctx.quadraticCurveTo(bottom.x, bottom.y, p5.x, p5.y);
  ctx.lineTo(p6.x, p6.y);
  ctx.quadraticCurveTo(left.x, left.y, p7.x, p7.y);
  ctx.lineTo(p8.x, p8.y);
  ctx.quadraticCurveTo(top.x, top.y, p1.x, p1.y);
  
  ctx.closePath();
  ctx.stroke();
}


    const renderShapes=()=>{
      ctx.clearRect(0,0,canvas.width,canvas.height);
      for(const shape of shapesRef.current){
        if(shape.type=="rectangle"){
          ctx.strokeRect(shape.startingX, shape.startingY, shape.width, shape.height);
        }
        else if(shape.type=="ellipse"){
          ctx.beginPath();
          ctx.ellipse(shape.centerX, shape.centerY, shape.radiusX, shape.radiusY,0,0,2*Math.PI);
          ctx.stroke();
        }
        else if(shape.type=='line'){
          ctx.beginPath(); 
          ctx.moveTo(shape.startingX, shape.startingY); 
          ctx.lineTo(shape.endingX, shape.endingY); 
          ctx.stroke();        
        }
        else if(shape.type=='icon'){
          drawRoundedDiamond(ctx, shape.centerX, shape.centerY, shape.width, shape.height, shape.radius);
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
    };
    renderShapes();

    if(selected=='rectangle'){
      let stX=0,stY=0;
      let clicked=false;

      const handleMousedown=(e:MouseEvent)=>{
            clicked=true;
            stX=e.clientX;
            stY=e.clientY;
      };
      const handleMouseup=(e:MouseEvent)=>{
            clicked=false;
            shapesRef.current.push({type:"rectangle",startingX:stX,startingY:stY,width:e.clientX-stX, height:e.clientY-stY});
      };
      const handleMousemove=(e:MouseEvent)=>{
        if(clicked){
          renderShapes();       
          const h=e.clientY-stY;
          const w=e.clientX-stX;
          ctx.strokeRect(stX,stY,w,h);
        }
      };

      canvas.addEventListener('mousedown',handleMousedown);
      canvas.addEventListener('mouseup',handleMouseup);
      canvas.addEventListener('mousemove',handleMousemove);
      return ()=>{
        canvas.removeEventListener("mousedown", handleMousedown);
        canvas.removeEventListener("mouseup", handleMouseup);
        canvas.removeEventListener("mousemove", handleMousemove);
      };
    }

    else if(selected=='ellipse'){
      let stX=0,stY=0;
      let clicked=false;
      const handleMousedown=(e:MouseEvent)=>{
        clicked=true;
         stX=e.clientX;
         stY=e.clientY;
      };
      const handleMouseup=(e:MouseEvent)=>{
        clicked=false;
        let w = e.clientX - stX;
        let h = e.clientY - stY;
        let x = stX + w / 2;
        let y = stY + h / 2;
        let rx = Math.abs(w) / 2;
        let ry = Math.abs(h) / 2;      
        shapesRef.current.push({  
          type: "ellipse",
          centerX: x,
          centerY: y,
          radiusX: rx,
          radiusY: ry
        });
      };
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
      };
      canvas.addEventListener('mousedown',handleMousedown);
      canvas.addEventListener('mouseup',handleMouseup);
      canvas.addEventListener('mousemove',handleMousemove);

      return()=>{  
        canvas.removeEventListener("mousedown", handleMousedown);
        canvas.removeEventListener("mouseup", handleMouseup);
        canvas.removeEventListener("mousemove", handleMousemove);
      };
    }
    else if(selected=="line"){

      let startX=0,startY=0;
      let clicked=false;
      const handleMousedown=(e:MouseEvent)=>{
        clicked=true;
        startX=e.clientX;
        startY=e.clientY;
      };
      const handleMouseup=(e:MouseEvent)=>{
        clicked=false;
        shapesRef.current.push({
                          type:"line",
                          startingX:startX,
                          startingY:startY,
                          endingX:e.clientX,
                          endingY:e.clientY,
        });
      };
      const handleMousemove=(e:MouseEvent)=>{
        if(clicked){
          renderShapes();
          ctx.beginPath(); 
          ctx.moveTo(startX, startY); 
          ctx.lineTo(e.clientX, e.clientY);
          ctx.stroke();      
        }
      };
      canvas.addEventListener('mousedown',handleMousedown);
      canvas.addEventListener('mouseup',handleMouseup);
      canvas.addEventListener('mousemove',handleMousemove);

      return()=>{  
        canvas.removeEventListener("mousedown", handleMousedown);
        canvas.removeEventListener("mouseup", handleMouseup);
        canvas.removeEventListener("mousemove", handleMousemove);
      };    
    }
else if (selected === "icon") {
  let stX = 0, stY = 0;
  let clicked = false;

  const handleMousedown = (e: MouseEvent) => {
    clicked = true;
    stX = e.clientX;
    stY = e.clientY;
  };

  const handleMouseup = (e: MouseEvent) => {
    clicked = false;
    let w = e.clientX - stX;
    let h = e.clientY - stY;
    let cx = stX + w / 2;
    let cy = stY + h / 2;
    shapesRef.current.push({
      type: "icon",
      centerX: cx,
      centerY: cy,
      width: Math.abs(w),
      height: Math.abs(h),
      radius: 20
    });
  };

  const handleMousemove = (e: MouseEvent) => {
    if (clicked) {
      renderShapes();
      let w = e.clientX - stX;
      let h = e.clientY - stY;
      let cx = stX + w / 2;
      let cy = stY + h / 2;
      drawRoundedDiamond(ctx, cx, cy, Math.abs(w), Math.abs(h), 20);
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
 else if(selected=='pen'){
  let currPoints:{x:number, y:number}[]=[]
  let linewidth=1;
  let clicked=false;
  const handleMousedown=(e:MouseEvent)=>{
    clicked=true;
    currPoints.push({x:e.clientX,y:e.clientY})
  }
  const handleMouseup=(e:MouseEvent)=>{
    clicked=false;
    shapesRef.current.push({type:"pen",lineWidth:2,points:currPoints})
    currPoints=[]
 
  }
  const handleMousemove=(e:MouseEvent)=>{
    if(clicked){
      currPoints.push({x:e.clientX,y:e.clientY});
      renderShapes();
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.beginPath();

      if(currPoints.length>1){
        let start=currPoints[0];
        if(start){
          ctx.moveTo(start.x,start.y)
          for(let i=1; i<currPoints.length; i++){
            const pt=currPoints[i];
            if(pt){
              ctx.lineTo(pt.x,pt.y);
            }
          }
        }
      }
      ctx.stroke()
    }
  }

  canvas.addEventListener('mousedown',handleMousedown)
  canvas.addEventListener('mouseup',handleMouseup)
  canvas.addEventListener('mousemove',handleMousemove)

  return () => {
    canvas.removeEventListener("mousedown", handleMousedown);
    canvas.removeEventListener("mouseup", handleMouseup);
    canvas.removeEventListener("mousemove", handleMousemove);
  };  
 }


  },[selected]);
  
  const handleClear=()=>{
    const canvas= canvasRef.current;
    if(!canvas) return;
    const ctx= canvas.getContext('2d');
    if(ctx){
       shapesRef.current=[];
       ctx.clearRect(0, 0, canvas.width, canvas.height); 
    }
  };

  return (
    <div className="w-screen h-screen bg-gray-300">
         <canvas ref={canvasRef} className="h-full w-full bg-[#121212] relative">
         </canvas>
         <div className="absolute top-4 left-4 flex flex-col gap-1">
            <button onClick={()=>{setSelected("rectangle")}} className="bg-white text-black p-1 rounded-md">rectangle</button>
            <button onClick={()=>{setSelected("ellipse")}} className="bg-white text-black rounded-md">circle</button>
            <button onClick={()=>{setSelected("line")}} className="bg-white text-black rounded-md">line</button>
            <button onClick={() => setSelected("icon")} className="bg-white text-black rounded-md">icon</button>
            <button onClick={() => setSelected("pen")} className="bg-white text-black rounded-md">pen</button>

            <button onClick={handleClear} className="bg-red-500 text-black rounded-md">clear</button>
         </div>
         
    </div>
  );
}
