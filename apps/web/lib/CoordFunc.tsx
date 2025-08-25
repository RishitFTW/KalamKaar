
export const toWorldCoords = (x: number, y: number,
       panOffSetref: React.MutableRefObject<{ x: number; y: number }>,
       zoomRef: React.MutableRefObject<number>) => ({
  x: (x - panOffSetref.current.x) / zoomRef.current,
  y: (y - panOffSetref.current.y) / zoomRef.current,
});

export const toScreenCoords = (x: number, y: number,
       panOffSetref: React.MutableRefObject<{ x: number; y: number }>,
       zoomRef: React.MutableRefObject<number>
) => ({
  x: x * zoomRef.current + panOffSetref.current.x,
  y: y * zoomRef.current + panOffSetref.current.y,
});