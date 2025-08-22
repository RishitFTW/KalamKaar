import React from 'react'
interface ToolProps{
  onClick:()=>void,
  selected:string
}
function Circle({onClick,selected}:ToolProps) {
  return (
<div onClick={onClick} className={`text-white ${selected=="ellipse" && "bg-[#48488E]"} flex items-center justify-center rounded-md px-1`}>
<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="12" cy="12" r="9"/>
</svg>

</div>
  )
}

export default Circle
