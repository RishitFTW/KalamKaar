import React from 'react'
import Users from '../app/icons/Users'

function Card() {
  return (
    <div>
<div className="group bg-gray-900 rounded-xl overflow-hidden border border-gray-800 transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/50 hover:border-gray-700 cursor-pointer relative">
  <div className="h-40" style={{ backgroundColor: '#4a2a5e' }}></div>
  <div className="p-4 flex justify-between items-center">
    <span className="font-medium text-white">Temp</span>
    <div className="flex items-center gap-2 text-gray-500 text-sm">
      <Users/>
      <span className='text-gray-600'>2</span>
    </div>
  </div>
  <div className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200">
    <i className="fa-solid fa-ellipsis-vertical text-sm"></i>
  </div>
</div>
 
</div>
  )
}

export default Card