import React from 'react'

interface ToolProps{
  onClick:()=>void,
  selected:string
}
function RectTool({onClick,selected}:ToolProps) {
  return (
<div onClick={onClick} className={`text-white ${selected=="rectangle" && "bg-[#48488E]"}  rounded-md flex items-center justify-center px-1`}>
<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
  <rect x="4" y="4" width="16" height="16" rx="2" ry="2"/>
</svg>


</div>

  )
}

export default RectTool
