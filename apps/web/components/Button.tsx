
import React, { ReactElement } from 'react'
import Link from '../app/icons/Link'
import Add from '../app/icons/Add'
interface ButtonProps{
    variant: "primary" | "secondary",
    text: String,
    icon:ReactElement
}

const variantClasses={
   "primary":" p-2 px-3 ",
   "secondary":" p-4 px-5 "
}

function Button({variant,text,icon}:ButtonProps) {
  return (
    <div>
       <button className={`${variantClasses[variant]} font-bold text-md bg-gray-800 text-white hover:bg-gray-700 flex rounded-md`}>{icon}<span className='pl-1'>{text}</span></button>
    </div>
  )
}

export default Button