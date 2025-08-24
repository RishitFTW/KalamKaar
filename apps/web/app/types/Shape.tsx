export type Shape = {
  type: "rectangle";
  x1: number;
  y1: number;
  width: number;
  height: number;
} | {
  type:"line"
  x1:number,
  y1:number,
  x2:number,
  y2:number,
} | {
  type: "icon";
  x1: number;
  y1: number;
  width: number;
  height: number;
  radius: number; 
} | {
  type:"pen";
  width:number;
  points:{x:number,y:number}[]
} | {
  type: "ellipse";
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};