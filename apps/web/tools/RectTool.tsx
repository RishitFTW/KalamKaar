import React from 'react'

interface ToolProps{
  onClick:()=>void,
  selected:string
}
function RectTool({onClick,selected}:ToolProps) {
  return (
<div onClick={onClick} className={`text-white ${selected=="rectangle" && "bg-[#48488E] "}  rounded-md flex items-center justify-center px-1 cursor-pointer`}>
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
  <rect x="4" y="4" width="16" height="16" rx="2" ry="2"/>
</svg>


</div>

  )
}

export default RectTool