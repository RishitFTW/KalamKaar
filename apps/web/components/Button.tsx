
import React, { ReactElement } from 'react'
import Link from '../app/icons/Link'
import Add from '../app/icons/Add'
interface ButtonProps{
    variant: "primary" | "secondary" | "tertiary",
    text: String,
    icon?:ReactElement,
    onClick?:()=>void
}

const variantClasses={
   "primary":" p-2 px-3 bg-gray-800",
   "secondary":" p-4 px-5 bg-gray-800",
   "tertiary":" p-2 px-3 bg-[#48488E]"
}

function Button({variant,text,icon,onClick}:ButtonProps) {
  return (
    <div>
       <button onClick={onClick}
       className={`${variantClasses[variant]} font-bold text-md text-white hover:bg-gray-700 flex rounded-md cursor-pointer`}>
                        {icon}<span className='pl-1'>{text}</span></button>
    </div>
  )
}

export default Button