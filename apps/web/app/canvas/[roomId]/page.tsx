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
import { useRectangleTool } from "../../../hooks/tool/useRectangleTool";
import { useEllipseTool } from "../../../hooks/tool/useEllipseTool";
import { usePenTool } from "../../../hooks/tool/usePenTool";
import { usePanTool } from "../../../hooks/tool/usePanTool";
import { useRhombusTool } from "../../../hooks/tool/useRhombusTool";
import { useLineTool } from "../../../hooks/tool/useLineTool";
import { Socket } from "socket.io-client";
const BASE_URL=process.env.NEXT_PUBLIC_API_URL

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
  const undoRef= useRef<Shape[]>([]) 
  const redoRef= useRef<Shape[]>([]) 
  const [user,setUser]= useState("")
  const [selected,setSelected]=useState("")
  const [members, setMembers]=useState([])
  const [loading,setLoading]=useState(true);
  const [hover, setHover] = useState<boolean | null>(null)
  const panOffSetref= useRef({x:0,y:0});
  const zoomRef= useRef(1)
  const router= useRouter();

  const params = useParams();
  const roomId = params?.roomId as string | undefined;
    if (!roomId) {
    return;
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
      const res= await axios.get(`${BASE_URL}/chat/${roomId}`,{
        headers:{
            Authorization:`Bearer ${token}`
        }
      })
      console.log(res.data)
      const members= await axios.get(`${BASE_URL}/room/members/${roomId}`,{
        headers:{
            Authorization:`Bearer ${token}`
        }
      })
      setMembers(members.data)

     shapesRef.current=res.data.data
     setUser(res.data.user)
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
    socket.on('recieve',(shapeData)=>{
      
        shapesRef.current.push(shapeData)
        const canvas= canvasRef.current;
        if (!canvas) return;

        canvas.width=window.innerWidth;
        canvas.height=window.innerHeight;
        const ctx= canvas.getContext('2d');
        if (!ctx) return;
        
        ctx.strokeStyle="white";
        RenderShapes(shapesRef,panOffSetref,canvasRef, zoomRef) 
    })
    socket.on('removeShape',(Shape)=>{
      for (let i = shapesRef.current.length - 1; i >= 0; i--) {
        if (shapesRef.current[i]?.id === Shape.id) {
          shapesRef.current.splice(i, 1);
          break; 
        }
      }
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


 useRectangleTool({user,undoRef, canvasRef, shapesRef, selected, RenderShapes, roomId, panOffSetref, zoomRef, toWorldCoords })
 useEllipseTool({user,undoRef, canvasRef, shapesRef, selected, RenderShapes, roomId, panOffSetref, zoomRef, toWorldCoords })
 usePenTool({user,undoRef, canvasRef, shapesRef, selected, RenderShapes, roomId, panOffSetref, zoomRef, toWorldCoords })
 usePanTool({user,undoRef, canvasRef, shapesRef, selected, RenderShapes, roomId, panOffSetref, zoomRef, toWorldCoords })
 useRhombusTool({user,undoRef, canvasRef, shapesRef, selected, RenderShapes, roomId, panOffSetref, zoomRef, toWorldCoords })
 useLineTool({user,undoRef, canvasRef, shapesRef, selected, RenderShapes, roomId, panOffSetref, zoomRef, toWorldCoords })

 
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
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
        `${BASE_URL}/chat/delete/${roomId}`,
        {
          headers: {
            Authorization:`Bearer ${token}`
          },
        }
      );

    } catch (error) {
      console.error("Error deleting chat:", error);
    }    
  };
  const handleUndo=async()=>{
    const socket= getSocket(Number(roomId))
    try {
      if(undoRef.current.length==0){
        return ;
      }
      const Shape=undoRef.current[undoRef.current.length-1]
      redoRef.current.push(undoRef.current[undoRef.current.length-1]!)
      undoRef.current.pop()
      for (let i = shapesRef.current.length - 1; i >= 0; i--) {
        if (shapesRef.current[i]?.id === Shape?.id) {
          shapesRef.current.splice(i, 1);
          break; 
        }
      }
      socket.emit('remove',Shape);
      RenderShapes(shapesRef,panOffSetref,canvasRef,zoomRef)
    } catch (error) {
      console.error("Error undoing chat:", error);     
    }
  }

  const handleRedo=async()=>{
    const socket= getSocket(Number(roomId))
    try {
      if(redoRef.current.length==0) return;
      const messageData=redoRef.current[redoRef.current.length-1]
      undoRef.current.push(redoRef.current[redoRef.current.length-1]!)
      shapesRef.current.push(redoRef.current[redoRef.current.length-1]!)
      redoRef.current.pop();
      socket.emit("msg",messageData)
      RenderShapes(shapesRef,panOffSetref,canvasRef,zoomRef)      
    } catch (error) {
      console.error("Error redoing chat:", error); 
    }
  }

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
           <Square icon={<Users flag={true} />} members={members} hover={hover} setHover={setHover}/>
         </div>
      {hover && (
        <div className="absolute bottom-18 right-8">
          <Members members={members} />
        </div>
      )}
        <div onClick={handleUndo} className="absolute bottom-9 left-50 text-white">undo</div>                 
        <div onClick={handleRedo} className="absolute bottom-9 left-80 text-white">redo</div>                 
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