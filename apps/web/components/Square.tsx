import React, { ReactElement } from "react"
import Members from "./Members"

interface SqProps {
  icon: ReactElement
  onClick?: () => void
  members?: { id: string; username: string }[]
  hover?: boolean | null
  setHover?: React.Dispatch<React.SetStateAction<boolean | null>>
}

function Square({ icon, onClick, members, hover, setHover }: SqProps) {
  return (
    <div
      className="relative inline-flex flex-col items-center"
      onMouseEnter={() => setHover?.(true)}
      onMouseLeave={() => setHover?.(false)}
    >
      <div
        onClick={onClick}
        className="bg-[#48488E] rounded-md p-2 px-4 cursor-pointer"
      >
        {icon}
      </div>
    </div>
  )
}

export default Square
