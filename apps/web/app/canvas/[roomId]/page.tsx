"use client"
import { useEffect, useRef, useState } from "react";
import { getSocket } from "../../../lib/socket";
import { drawRoundedDiamond } from "../../../lib/DiamondShape"
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import Square from "../../../components/Square";
import Home from "../../icons/Home";
import Share from "../../icons/Share";
import Users from "../../icons/Users";
import RectTool from "../../../tools/RectTool";
import Rhombus from "../../../tools/Rhombus";
import Circle from "../../../tools/Circle";
import Line from "../../../tools/Line";
import Pencil from "../../../tools/Pencil";
import Bin from "../../../tools/Bin";
import Loader from "../../../components/Loader";

import { Shape } from "../../../types/Shape";
import Hand from "../../../tools/Hand";
import { RenderShapes } from "../../../lib/renderShapes";
import { handleCopy } from "../../../lib/CopyID";
import Members from "../../../components/Members";

export default function Canvas() {

const toWorldCoords = (x: number, y: number) => ({
  x: (x - panOffSetref.current.x) / zoomRef.current,
  y: (y - panOffSetref.current.y) / zoomRef.current,
});

const toScreenCoords = (x: number, y: number) => ({
  x: x * zoomRef.current + panOffSetref.current.x,
  y: y * zoomRef.current + panOffSetref.current.y,
});
  const canvasRef= useRef<HTMLCanvasElement>(null);
  const shapesRef = useRef<Shape[]>([]);
  const [selected,setSelected]=useState("")
  const [members, setMembers]=useState([])
  const [loading,setLoading]=useState(true);
  const panOffSetref= useRef({x:0,y:0});
  const zoomRef= useRef(1)
  const router= useRouter();

  const params = useParams();
  const roomId = params?.roomId as string | undefined;
    if (!roomId) {
    return <div>No roomId provided</div>;
  }


  useEffect(()=>{
    const token=localStorage.getItem('authToken');
    if(!token){
      router.push('/')
    }
    const socket=getSocket(Number(roomId))
    socket.on("connect", () => {
      console.log("Connected to server:", socket.id);
    });
    const f=async()=>{
      const token= localStorage.getItem('authToken')
      const res= await axios.get(`http://localhost:3001/api/v1/chat/${roomId}`,{
        headers:{
            Authorization:`Bearer ${token}`
        }
      })
      const members= await axios.get(`http://localhost:3001/api/v1/room/members/${roomId}`,{
        headers:{
            Authorization:`Bearer ${token}`
        }
      })
      console.log(`Members-> ${members.data.members}`)
      setMembers(members.data.members)

     shapesRef.current=res.data.data
     const canvas= canvasRef.current;
    if (!canvas) return;

    canvas.width=window.innerWidth;
    canvas.height=window.innerHeight;
    const ctx= canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.strokeStyle="white";
       
    RenderShapes(shapesRef,panOffSetref,canvasRef, zoomRef)      
    }
    f();
    setLoading(false)
    socket.on('recieve',(messageData)=>{
    shapesRef.current.push(messageData)
     const canvas= canvasRef.current;
    if (!canvas) return;

    canvas.width=window.innerWidth;
    canvas.height=window.innerHeight;
    const ctx= canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.strokeStyle="white";
       
    RenderShapes(shapesRef,panOffSetref,canvasRef, zoomRef) 
    })
  },[])

  useEffect(() => {
    const socket = getSocket(Number(roomId));
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.strokeStyle = "white";

    RenderShapes(shapesRef, panOffSetref, canvasRef, zoomRef)

    if (selected == 'rectangle') {
        let stX = 0, stY = 0;
        let clicked = false;

        const handleMousedown = (e: MouseEvent) => {
            clicked = true;
            const world= toWorldCoords(e.clientX,e.clientY)
            stX = world.x;
            stY = world.y;
        };
        const handleMouseup = (e: MouseEvent) => {
            if (!clicked) return;
            clicked = false;

            // FIX: Convert start coordinates to world space before saving
            const world= toWorldCoords(e.clientX,e.clientY)
            const width = world.x - stX;
            const height = world.y - stY;

            const newShape = { type: "rectangle", x1: stX, y1: stY, width, height };
            shapesRef.current.push({ type: "rectangle", x1: stX, y1: stY, width, height });
            socket.emit('msg', newShape)
        };
        const handleMousemove = (e: MouseEvent) => {
            if (clicked) {
                RenderShapes(shapesRef, panOffSetref, canvasRef,zoomRef)
                const world=toWorldCoords(e.clientX,e.clientY)
                const h = world.y - stY;
                const w = world.x - stX;
                    ctx.save();
                    ctx.translate(panOffSetref.current.x, panOffSetref.current.y);
                    ctx.scale(zoomRef.current, zoomRef.current);
                    ctx.strokeRect(stX, stY, w, h);
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

else if (selected == 'ellipse') {
    let stX = 0, stY = 0;
    let clicked = false;

    const handleMousedown = (e: MouseEvent) => {
        clicked = true;
        const world = toWorldCoords(e.clientX, e.clientY);
        stX = world.x;
        stY = world.y;
    };

    const handleMouseup = (e: MouseEvent) => {
        if (!clicked) return;
        clicked = false;
        
        const world = toWorldCoords(e.clientX, e.clientY);
        const w = world.x - stX;
        const h = world.y - stY;

        const worldCenterX = stX + w / 2;
        const worldCenterY = stY + h / 2;
        const rx = Math.abs(w) / 2;
        const ry = Math.abs(h) / 2;

        const newShape = {
            type: "ellipse",
            x1: worldCenterX,
            y1: worldCenterY,
            x2: rx,
            y2: ry
        };
        
        shapesRef.current.push({
            type: "ellipse",
            x1: worldCenterX,
            y1: worldCenterY,
            x2: rx,
            y2: ry
        });
        socket.emit('msg', newShape);
        RenderShapes(shapesRef, panOffSetref, canvasRef, zoomRef);
    };

    const handleMousemove = (e: MouseEvent) => {
        if (clicked) {
            RenderShapes(shapesRef, panOffSetref, canvasRef, zoomRef);
            
            const world = toWorldCoords(e.clientX, e.clientY);
            const w = world.x - stX;
            const h = world.y - stY;

            const worldCenterX = stX + w / 2;
            const worldCenterY = stY + h / 2;
            const rx = Math.abs(w) / 2;
            const ry = Math.abs(h) / 2;
            
            ctx.save();
            ctx.translate(panOffSetref.current.x, panOffSetref.current.y);
            ctx.scale(zoomRef.current, zoomRef.current);
            ctx.beginPath();
            ctx.ellipse(worldCenterX, worldCenterY, rx, ry, 0, 0, 2 * Math.PI);
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
else if (selected == "line") {
    let startX = 0, startY = 0;
    let clicked = false;

    const handleMousedown = (e: MouseEvent) => {
        clicked = true;
        startX = e.clientX;
        startY = e.clientY;
    };

    const handleMouseup = (e: MouseEvent) => {
        if (!clicked) return;
        clicked = false;

        const world1 = toWorldCoords(startX, startY);
        const world2 = toWorldCoords(e.clientX, e.clientY);

        const newShape = {
            type: "line" as const, 
            x1: world1.x,
            y1: world1.y,
            x2: world2.x,
            y2: world2.y, 
        };
        
        shapesRef.current.push(newShape);
        socket.emit('msg', newShape);
        RenderShapes(shapesRef, panOffSetref, canvasRef, zoomRef);
    };

    const handleMousemove = (e: MouseEvent) => {
        if (clicked) {
            RenderShapes(shapesRef, panOffSetref, canvasRef, zoomRef);
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(e.clientX, e.clientY);
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
else if (selected === "icon") {
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

        const newShape = {
            type: "icon" as const,
            x1: world.x,
            y1: world.y,
            width: worldWidth,
            height: worldHeight,
            radius: 20
        };
        
        shapesRef.current.push(newShape);
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
else if (selected == 'pen') {
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
    else if (selected == 'handgrip') {
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


}, [selected]);

useEffect(() => {
  const canvas = canvasRef.current;
  if (!canvas) return;
  console.log("running")
  const handleWheel = (e: WheelEvent) => {
    e.preventDefault();
    console.log("running")
    const zoomFactor = 1.1;
    const mouse = { x: e.clientX, y: e.clientY };

    const worldPos = toWorldCoords(mouse.x, mouse.y);

    if (e.deltaY < 0) {
      zoomRef.current = Math.min(zoomRef.current * zoomFactor, 10);
    } else {
      zoomRef.current = Math.max(zoomRef.current / zoomFactor, 0.1);
    }

    const newScreenPos = toScreenCoords(worldPos.x, worldPos.y);
    panOffSetref.current.x += mouse.x - newScreenPos.x;
    panOffSetref.current.y += mouse.y - newScreenPos.y;

    RenderShapes(shapesRef, panOffSetref, canvasRef, zoomRef);
  };


  canvas.addEventListener("wheel", handleWheel, { passive: false });
  return () => canvas.removeEventListener("wheel", handleWheel);
}, [RenderShapes, toWorldCoords, toScreenCoords]);
  
  const handleClear=async()=>{
    const canvas= canvasRef.current;
    if(!canvas) return;
    const ctx= canvas.getContext('2d');
    if(ctx){
       shapesRef.current=[];
       ctx.clearRect(0, 0, canvas.width, canvas.height); 
    }
    try {
      const token=localStorage.getItem('authToken')
      const res = await axios.delete(
        `http://localhost:3001/api/v1/chat/${roomId}`,
        {
          headers: {
            Authorization:`Bearer ${token}`
          },
        }
      );

      console.log("Deleted:", res.data);

    } catch (error) {
      console.error("Error deleting chat:", error);
    }    
  };
  if(loading){
    return <Loader/>
  }
  return (
    <div className="w-screen h-screen bg-gray-300">
         <canvas ref={canvasRef} className="h-full w-full bg-[#18181B] relative">
         </canvas>
         <div className="absolute top-4 left-8">
           <Square icon={<Home/>} onClick={()=>{router.push('/dashboard')}}/>
         </div>
         <div className="absolute top-4 right-8">
           <Square icon={<Share/>} onClick={()=>{handleCopy(roomId)}}/>
         </div>
         <div className="absolute bottom-4 right-8">
           <Square icon={<Users flag={true} />}/>
         </div>
         <Members/>
         <div className="absolute top-4 left-150 flex  bg-[#27272A] gap-3 px-4 py-2 rounded-lg">
            <Hand onClick={()=>{setSelected("handgrip")}} selected={selected}/>            
            <RectTool onClick={()=>{setSelected("rectangle")}} selected={selected}/>
            <Rhombus onClick={()=>{setSelected("icon")}} selected={selected}/>
            <Circle onClick={()=>{setSelected("ellipse")}} selected={selected}/>
            <Line onClick={()=>{setSelected("line")}} selected={selected}/>
            <Pencil onClick={()=>{setSelected("pen")}} selected={selected}/>
             <div className="w-[1px] h-6 bg-zinc-600 mx-2 mt-1"></div>
            <Bin onClick={handleClear} />
         </div>
    </div>
  );
}