export function drawRoundedDiamond(ctx:CanvasRenderingContext2D, x:number, y:number, w:number, h:number, r:number){
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