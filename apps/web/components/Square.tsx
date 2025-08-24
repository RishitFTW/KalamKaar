import React, { ReactElement } from 'react'
import Home from '../app/icons/Home'
interface SqProps{
    icon:ReactElement
    onClick?:()=>void
}
function Square({icon,onClick}:SqProps) {
  return (
    <div onClick={onClick} className='bg-[#48488E] rounded-md p-2 px-4 cursor-pointer'>
      {icon}
    </div>
  )
}

export default Square
