import React, { ReactElement } from 'react'
import Home from '../app/icons/Home'
interface SqProps{
    icon:ReactElement
}
function Square({icon}:SqProps) {
  return (
    <div className='bg-[#27272A] rounded-md p-2 px-4 cursor-pointer'>
      {icon}
    </div>
  )
}

export default Square
