"use client"
import { useEffect, useRef, useState } from "react";

// --- TYPE DEFINITIONS ---
interface Rectangle {
  type: "rectangle";
  startingX: number;
  startingY: number;
  width: number;
  height: number;
}

interface Line {
  type: "line";
  startingX: number;
  startingY: number;
  endingX: number;
  endingY: number;
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
  radius: number;
}

interface Pen {
  type: "pen";
  points: { x: number; y: number }[];
  lineWidth: number;
}

type Shape = Rectangle | Ellipse | Line | Icon | Pen;

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const shapesRef = useRef<Shape[]>([]);
  const [selected, setSelected] = useState('rectangle');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;


    function getMousePos(canvasEl: HTMLCanvasElement, e: MouseEvent) {
      const rect = canvasEl.getBoundingClientRect();
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    }

    function drawRoundedDiamond(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
      if (w < 2 * r) r = w / 2;
      if (h < 2 * r) r = h / 2;
      const hw = w / 2;
      const hh = h / 2;
      const top = { x: x, y: y - hh };
      const right = { x: x + hw, y: y };
      const bottom = { x: x, y: y + hh };
      const left = { x: x - hw, y: y };
      const edgeLength = Math.sqrt(hw * hw + hh * hh);
      const radius = Math.min(r, edgeLength / 2);
      const ratio = radius / edgeLength;
      const p1 = { x: top.x + hw * ratio, y: top.y + hh * ratio };
      const p2 = { x: right.x - hw * ratio, y: right.y - hh * ratio };
      const p3 = { x: right.x - hw * ratio, y: right.y + hh * ratio };
      const p4 = { x: bottom.x + hw * ratio, y: bottom.y - hh * ratio };
      const p5 = { x: bottom.x - hw * ratio, y: bottom.y - hh * ratio };
      const p6 = { x: left.x + hw * ratio, y: left.y + hh * ratio };
      const p7 = { x: left.x + hw * ratio, y: left.y - hh * ratio };
      const p8 = { x: top.x - hw * ratio, y: top.y + hh * ratio };

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


    const renderShapes = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const shape of shapesRef.current) {
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        
        if (shape.type === "rectangle") {
          ctx.strokeRect(shape.startingX, shape.startingY, shape.width, shape.height);
        } else if (shape.type === "ellipse") {
          ctx.beginPath();
          ctx.ellipse(shape.centerX, shape.centerY, shape.radiusX, shape.radiusY, 0, 0, 2 * Math.PI);
          ctx.stroke();
        } else if (shape.type === 'line') {
          ctx.beginPath();
          ctx.moveTo(shape.startingX, shape.startingY);
          ctx.lineTo(shape.endingX, shape.endingY);
          ctx.stroke();
        } else if (shape.type === 'icon') {
          drawRoundedDiamond(ctx, shape.centerX, shape.centerY, shape.width, shape.height, shape.radius);
        } else if (shape.type === 'pen') {
          ctx.lineWidth = shape.lineWidth;
          ctx.lineCap = 'round';
          ctx.beginPath();
          
          const firstPoint = shape.points[0];
          if (firstPoint) {
            ctx.moveTo(firstPoint.x, firstPoint.y);
            for (let i = 1; i < shape.points.length; i++) {
              const point = shape.points[i];
              if (point) {
                  ctx.lineTo(point.x, point.y);
              }
            }
          }
          ctx.stroke();
        }
      }
    };
    renderShapes();


    let isDrawing = false;
    let startX = 0, startY = 0;

    const handleMousedown = (e: MouseEvent) => {
      isDrawing = true;
      const pos = getMousePos(canvas, e);
      startX = pos.x;
      startY = pos.y;
    };

    const handleMouseup = (e: MouseEvent) => {
      if (!isDrawing) return;
      isDrawing = false;
      const pos = getMousePos(canvas, e);

      const width = pos.x - startX;
      const height = pos.y - startY;

      if (selected === 'rectangle') {
        if (width !== 0 || height !== 0) shapesRef.current.push({ type: "rectangle", startingX: startX, startingY: startY, width: width, height: height });
      } else if (selected === 'ellipse') {
        if (width !== 0 || height !== 0) shapesRef.current.push({
          type: "ellipse",
          centerX: startX + width / 2,
          centerY: startY + height / 2,
          radiusX: Math.abs(width) / 2,
          radiusY: Math.abs(height) / 2
        });
      } else if (selected === 'line') {
        if (width !== 0 || height !== 0) shapesRef.current.push({ type: "line", startingX: startX, startingY: startY, endingX: pos.x, endingY: pos.y });
      } else if (selected === 'icon') {
          if (width !== 0 || height !== 0) shapesRef.current.push({
            type: "icon",
            centerX: startX + width / 2,
            centerY: startY + height / 2,
            width: Math.abs(width),
            height: Math.abs(height),
            radius: 20,
          });
      }
      renderShapes();
    };

    const handleMousemove = (e: MouseEvent) => {
      if (!isDrawing) return;
      const pos = getMousePos(canvas, e);
      
      renderShapes();

      const width = pos.x - startX;
      const height = pos.y - startY;
      
      ctx.lineWidth = 2;
      ctx.lineCap = 'butt';
      
      if (selected === 'rectangle') {
        ctx.strokeRect(startX, startY, width, height);
      } else if (selected === 'ellipse') {
        ctx.beginPath();
        ctx.ellipse(startX + width / 2, startY + height / 2, Math.abs(width) / 2, Math.abs(height) / 2, 0, 0, 2 * Math.PI);
        ctx.stroke();
      } else if (selected === 'line') {
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
      } else if (selected === 'icon') {
        drawRoundedDiamond(ctx, startX + width/2, startY + height/2, Math.abs(width), Math.abs(height), 20);
      }
    };

    if (selected === 'pen') {
      let currentPoints: { x: number; y: number }[] = [];

      const penMouseDown = (e: MouseEvent) => {
        isDrawing = true;
        const pos = getMousePos(canvas, e);
        currentPoints = [{ x: pos.x, y: pos.y }];
      };

      const penMouseMove = (e: MouseEvent) => {
        if (!isDrawing) return;
        const pos = getMousePos(canvas, e);
        currentPoints.push({ x: pos.x, y: pos.y });

        renderShapes();
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.beginPath();
        

        const firstPoint = currentPoints[0];
        if (firstPoint) {
          ctx.moveTo(firstPoint.x, firstPoint.y);
          for (let i = 1; i < currentPoints.length; i++) {
            const point = currentPoints[i];
            if (point) {
              ctx.lineTo(point.x, point.y);
            }
          }
        }
        ctx.stroke();
      };

      const penMouseUp = () => {
        isDrawing = false;
        if (currentPoints.length > 1) {
          shapesRef.current.push({
            type: "pen",
            points: currentPoints,
            lineWidth: 2
          });
        }
        currentPoints = [];
        renderShapes();
      };

      canvas.addEventListener('mousedown', penMouseDown);
      canvas.addEventListener('mousemove', penMouseMove);
      canvas.addEventListener('mouseup', penMouseUp);
      canvas.addEventListener('mouseleave', penMouseUp);

      return () => {
        canvas.removeEventListener('mousedown', penMouseDown);
        canvas.removeEventListener('mousemove', penMouseMove);
        canvas.removeEventListener('mouseup', penMouseUp);
        canvas.removeEventListener('mouseleave', penMouseUp);
      };

    } else {
      canvas.addEventListener('mousedown', handleMousedown);
      canvas.addEventListener('mousemove', handleMousemove);
      canvas.addEventListener('mouseup', handleMouseup);
      canvas.addEventListener('mouseleave', handleMouseup);

      return () => {
        canvas.removeEventListener('mousedown', handleMousedown);
        canvas.removeEventListener('mousemove', handleMousemove);
        canvas.removeEventListener('mouseup', handleMouseup);
        canvas.removeEventListener('mouseleave', handleMouseup);
      };
    }
  }, [selected]);

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      shapesRef.current = [];
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  return (
    <div className="w-screen h-screen bg-gray-300">
      <canvas ref={canvasRef} className="h-full w-full bg-[#121212] relative">
      </canvas>
      <div className="absolute top-4 left-4 flex flex-col gap-1">
        <button onClick={() => { setSelected("rectangle") }} className="bg-white text-black p-1 rounded-md">rectangle</button>
        <button onClick={() => { setSelected("ellipse") }} className="bg-white text-black p-1 rounded-md">circle</button>
        <button onClick={() => { setSelected("line") }} className="bg-white text-black p-1 rounded-md">line</button>
        <button onClick={() => setSelected("icon")} className="bg-white text-black p-1 rounded-md">icon</button>
        <button onClick={() => setSelected("pen")} className="bg-white text-black p-1 rounded-md">pen</button>
        <button onClick={handleClear} className="bg-red-500 text-white p-1 rounded-md">clear</button>
      </div>
    </div>
  );
}