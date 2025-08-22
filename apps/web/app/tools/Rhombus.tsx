import React from 'react'
interface ToolProps{
  onClick:()=>void,
  selected:string
}
function Rhombus({onClick,selected}:ToolProps) {
  return (
    <div onClick={onClick} className={`text-white flex items-center justify-center ${selected=="icon" && "bg-[#48488E]"} rounded-md px-1`}>
        <svg xmlns="http://www.w3.org/2000/svg" width="27" height="27" viewBox="0 0 64 64">
        <rect x="16" y="16" width="32" height="32"
                rx="4" ry="4"
                transform="rotate(45 32 32)"
                fill="none" stroke="currentColor" stroke-width="3"/>
        </svg>

    </div>
  )
}

export default Rhombus
