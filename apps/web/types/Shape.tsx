export type Shape = {
  id:string;
  type: "rectangle";
  x1: number;
  y1: number;
  width: number;
  height: number;
} | {
  id:string;
  type:"line"
  x1:number,
  y1:number,
  x2:number,
  y2:number,
} | {
  id:string;
  type: "icon";
  x1: number;
  y1: number;
  width: number;
  height: number;
  radius: number; 
} | {
  id:string;
  type:"pen";
  width:number;
  points:{x:number,y:number}[]
} | {
  id:string;
  type: "ellipse";
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};