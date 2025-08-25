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
import RectTool from "../../tools/RectTool";
import Rhombus from "../../tools/Rhombus";
import Circle from "../../tools/Circle";
import Line from "../../tools/Line";
import Pencil from "../../tools/Pencil";
import Bin from "../../tools/Bin";
import Loader from "../../../components/Loader";
import { RenderShapes } from "../../../lib/renderShapes";
import { Shape } from "../../types/Shape";
import Hand from "../../tools/Hand";
export default function Canvas() {

  const canvasRef= useRef<HTMLCanvasElement>(null);
  const shapesRef = useRef<Shape[]>([]);
  const [selected,setSelected]=useState('circle')
  const [loading,setLoading]=useState(true);
  const panOffSetref= useRef({x:0,y:0});
  const zommOffSetref= useRef(1)
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
    console.log(roomId)
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
     shapesRef.current=res.data.data
     const canvas= canvasRef.current;
    if (!canvas) return;

    canvas.width=window.innerWidth;
    canvas.height=window.innerHeight;
    const ctx= canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.strokeStyle="white";
       
    RenderShapes(shapesRef,panOffSetref,canvasRef)      
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
       
    RenderShapes(shapesRef,panOffSetref,canvasRef) 
    })
  },[])

  useEffect(() => {
    const socket = getSocket(1);
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.strokeStyle = "white";

    RenderShapes(shapesRef, panOffSetref, canvasRef)

    if (selected == 'rectangle') {
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

            // FIX: Convert start coordinates to world space before saving
            const worldX1 = stX - panOffSetref.current.x;
            const worldY1 = stY - panOffSetref.current.y;
            const width = e.clientX - stX;
            const height = e.clientY - stY;

            const newShape = { type: "rectangle", x1: worldX1, y1: worldY1, width, height };
            shapesRef.current.push({ type: "rectangle", x1: worldX1, y1: worldY1, width, height });
            socket.emit('msg', newShape)
        };
        const handleMousemove = (e: MouseEvent) => {
            if (clicked) {
                RenderShapes(shapesRef, panOffSetref, canvasRef)
                const h = e.clientY - stY;
                const w = e.clientX - stX;
                ctx.strokeRect(stX, stY, w, h);
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
            stX = e.clientX;
            stY = e.clientY;
        };
        const handleMouseup = (e: MouseEvent) => {
            if (!clicked) return;
            clicked = false;
            let w = e.clientX - stX;
            let h = e.clientY - stY;

            // FIX: Calculate center in screen space, then convert to world space for saving
            let screenCenterX = stX + w / 2;
            let screenCenterY = stY + h / 2;
            let worldCenterX = screenCenterX - panOffSetref.current.x;
            let worldCenterY = screenCenterY - panOffSetref.current.y;

            let rx = Math.abs(w) / 2;
            let ry = Math.abs(h) / 2;
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
            socket.emit('msg', newShape)
        };
        const handleMousemove = (e: MouseEvent) => {
            if (clicked) {
                RenderShapes(shapesRef, panOffSetref, canvasRef)
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

            // FIX: Convert both start and end points to world space
            const worldX1 = startX - panOffSetref.current.x;
            const worldY1 = startY - panOffSetref.current.y;
            const worldX2 = e.clientX - panOffSetref.current.x;
            const worldY2 = e.clientY - panOffSetref.current.y;

            const newShape = {
                type: "line",
                x1: worldX1,
                y1: worldY1,
                x2: worldX2,
                y2: worldY2,
            };
            shapesRef.current.push({
                type: "line",
                x1: worldX1,
                y1: worldY1,
                x2: worldX2,
                y2: worldY2,
            });
            socket.emit('msg', newShape)
        };
        const handleMousemove = (e: MouseEvent) => {
            if (clicked) {
                RenderShapes(shapesRef, panOffSetref, canvasRef)
                ctx.beginPath();
                ctx.moveTo(startX, startY);
                ctx.lineTo(e.clientX, e.clientY);
                ctx.stroke();
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
            let w = e.clientX - stX;
            let h = e.clientY - stY;

            // FIX: Calculate screen center, then convert to world center
            let screenCx = stX + w / 2;
            let screenCy = stY + h / 2;
            let worldCx = screenCx - panOffSetref.current.x;
            let worldCy = screenCy - panOffSetref.current.y;

            const newShape = {
                type: "icon",
                x1: worldCx,
                y1: worldCy,
                width: Math.abs(w),
                height: Math.abs(h),
                radius: 20
            };
            shapesRef.current.push({
                type: "icon",
                x1: worldCx,
                y1: worldCy,
                width: Math.abs(w),
                height: Math.abs(h),
                radius: 20
            });
            socket.emit('msg', newShape)
        };

        const handleMousemove = (e: MouseEvent) => {
            if (clicked) {
                RenderShapes(shapesRef, panOffSetref, canvasRef)
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
    else if (selected == 'pen') {
        let currPoints: { x: number, y: number }[] = []
        let clicked = false;
        const handleMousedown = (e: MouseEvent) => {
            clicked = true;
            currPoints.push({ x: e.clientX, y: e.clientY })
        }
        const handleMouseup = (e: MouseEvent) => {
            if (!clicked) return;
            clicked = false;

            // FIX: Convert all collected points to world space before saving
            const worldPoints = currPoints.map(p => ({
                x: p.x - panOffSetref.current.x,
                y: p.y - panOffSetref.current.y
            }));
            
            shapesRef.current.push({ type: "pen", width: 2, points: worldPoints });
            socket.emit('msg', { type: "pen", lineWidth: 2, points: worldPoints });
            currPoints = [];
        }
        const handleMousemove = (e: MouseEvent) => {
            if (clicked) {
                currPoints.push({ x: e.clientX, y: e.clientY });
                RenderShapes(shapesRef, panOffSetref, canvasRef)
                ctx.lineWidth = 2;
                ctx.lineCap = 'round';
                ctx.beginPath();

                if (currPoints.length > 1) {
                    let start = currPoints[0];
                    if (start) {
                        ctx.moveTo(start.x, start.y)
                        for (let i = 1; i < currPoints.length; i++) {
                            const pt = currPoints[i];
                            if (pt) {
                                ctx.lineTo(pt.x, pt.y);
                            }
                        }
                    }
                }
                ctx.stroke()
            }
        }

        canvas.addEventListener('mousedown', handleMousedown)
        canvas.addEventListener('mouseup', handleMouseup)
        canvas.addEventListener('mousemove', handleMousemove)

        return () => {
            canvas.removeEventListener("mousedown", handleMousedown);
            canvas.removeEventListener("mouseup", handleMouseup);
            canvas.removeEventListener("mousemove", handleMousemove);
        };
    }
    else if (selected == 'handgrip') {
        RenderShapes(shapesRef, panOffSetref, canvasRef)
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

                RenderShapes(shapesRef, panOffSetref, canvasRef)
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
         <canvas ref={canvasRef} className="h-full w-full bg-[#121212] relative">
         </canvas>
         <div className="absolute top-4 left-8">
           <Square icon={<Home/>} onClick={()=>{router.push('/dashboard')}}/>
         </div>
         <div className="absolute top-4 right-8">
           <Square icon={<Share/>}/>
         </div>
         <div className="absolute bottom-4 right-8">
           <Square icon={<Users flag={true}/>}/>
         </div>
         
         <div className="absolute top-4 left-150 flex  bg-[#27272A] gap-3 px-3 py-1 rounded-lg">
            <Hand onClick={()=>{setSelected("handgrip")}} selected={selected}/>            
            <RectTool onClick={()=>{setSelected("rectangle")}} selected={selected}/>
            <Rhombus onClick={()=>{setSelected("icon")}} selected={selected}/>
            <Circle onClick={()=>{setSelected("ellipse")}} selected={selected}/>
            <Line onClick={()=>{setSelected("line")}} selected={selected}/>
            <Pencil onClick={()=>{setSelected("pen")}} selected={selected}/>
            <Bin onClick={handleClear} />
         </div>
         
    </div>
  );
}