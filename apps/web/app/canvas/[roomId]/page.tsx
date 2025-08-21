"use client"
import { useEffect, useRef, useState } from "react";
import { getSocket } from "../../../lib/socket";
import { drawRoundedDiamond } from "../../../lib/DiamondShape"

import axios from "axios";

import { useParams } from "next/navigation";

interface Rectangle {
  type: "rectangle";
  x1: number;
  y1: number;
  width: number;
  height: number;
}

interface Line{
  type:"line"
  x1:number,
  y1:number,
  x2:number,
  y2:number,
}

interface Ellipse {
  type: "ellipse";
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

interface Icon {
  type: "icon";
  x1: number;
  y1: number;
  width: number;
  height: number;
  radius: number; 
}

interface Pen{
  type:"pen";
  width:number;
  points:{x:number,y:number}[]
}

type Shape = Rectangle | Ellipse | Line | Icon | Pen;

export default function Canvas() {
  const canvasRef= useRef<HTMLCanvasElement>(null);
  const shapesRef = useRef<Shape[]>([]);
  const [selected,setSelected]=useState('circle')

  const params= useParams();
  const roomId=params.roomId

  useEffect(()=>{
    const socket=getSocket(Number(roomId))
    console.log(roomId)
    socket.on("connect", () => {
      console.log("Connected to server:", socket.id);
    });
    const f=async()=>{
      let roomId=1
      const token= localStorage.getItem('authToken')
      const res= await axios.get(`http://localhost:3001/api/v1/chat/${roomId}`,{
        headers:{
            Authorization:`Bearer ${token}`
        }
      })
     shapesRef.current=res.data.data
     const canvas= canvasRef.current;
    if (!canvas) return;

    canvas.width=window.innerWidth;
    canvas.height=window.innerHeight;
    const ctx= canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.strokeStyle="white";
       
    const renderShapes=()=>{
      ctx.clearRect(0,0,canvas.width,canvas.height);
      for(const shape of shapesRef.current){
        if(shape.type=="rectangle"){
          ctx.strokeRect(shape.x1, shape.y1, shape.width, shape.height);
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
    };
    renderShapes()      
    }
    f();
    socket.on('recieve',(messageData)=>{
    shapesRef.current.push(messageData)
     const canvas= canvasRef.current;
    if (!canvas) return;

    canvas.width=window.innerWidth;
    canvas.height=window.innerHeight;
    const ctx= canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.strokeStyle="white";
       
    const renderShapes=()=>{
      ctx.clearRect(0,0,canvas.width,canvas.height);
      for(const shape of shapesRef.current){
        if(shape.type=="rectangle"){
          ctx.strokeRect(shape.x1, shape.y1, shape.width, shape.height);
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
    };
    renderShapes()
    })
    
  },[])

  useEffect(()=>{
    const socket=getSocket(1);
    const canvas= canvasRef.current;
    if (!canvas) return;

    canvas.width=window.innerWidth;
    canvas.height=window.innerHeight;
    const ctx= canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.strokeStyle="white";

    const renderShapes=()=>{
      ctx.clearRect(0,0,canvas.width,canvas.height);
      for(const shape of shapesRef.current){
        if(shape.type=="rectangle"){
          ctx.strokeRect(shape.x1, shape.y1, shape.width, shape.height);
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
            shapesRef.current.push({type:"rectangle",x1:stX,y1:stY,width:e.clientX-stX, height:e.clientY-stY});
            socket.emit('msg',{type:"rectangle",x1:stX,y1:stY,width:e.clientX-stX, height:e.clientY-stY})
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
          x1: x,
          y1: y,
          x2: rx,
          y2: ry
        });
        socket.emit('msg',{  
          type: "ellipse",
          x1: x,
          y1: y,
          x2: rx,
          y2: ry
        })
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
                          x1:startX,
                          y1:startY,
                          x2:e.clientX,
                          y2:e.clientY,
        });
        socket.emit('msg',{
                          type:"line",
                          x1:startX,
                          y1:startY,
                          x2:e.clientX,
                          y2:e.clientY,
        })
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
      x1: cx,
      y1: cy,
      width: Math.abs(w),
      height: Math.abs(h),
      radius: 20
    });
    socket.emit('msg',{
      type: "icon",
      x1: cx,
      y1: cy,
      width: Math.abs(w),
      height: Math.abs(h),
      radius: 20
    })
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
    shapesRef.current.push({type:"pen",width:2,points:currPoints})
    socket.emit('msg',{type:"pen",lineWidth:2,points:currPoints})
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
