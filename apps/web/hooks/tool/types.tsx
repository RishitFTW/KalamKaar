import { Shape } from "../../types/Shape";

export interface ToolProps {
  user:string
  undoRef: React.MutableRefObject<Shape[]>;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  shapesRef: React.MutableRefObject<Shape[]>;
  selected: string;
  RenderShapes: Function;
  roomId: string;
  panOffSetref: React.MutableRefObject<{ x: number; y: number }>;
  zoomRef: React.MutableRefObject<number>;
  toWorldCoords: (x: number, y: number) => { x: number; y: number };
}
