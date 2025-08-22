import React from 'react'
interface ToolProps{
  onClick:()=>void,
  selected:string
}
function Line({onClick,selected}:ToolProps) {
  return (
<div onClick={onClick} className={`text-white ${selected=="line" && "bg-[#48488E]"} rounded-md flex items-center justify-center`}>
<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
  <line x1="5" y1="12" x2="19" y2="12"/>
</svg>

</div>
  )
}

export default Line
