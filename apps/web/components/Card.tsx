import React, { ReactElement, useEffect } from 'react'
import Users from '../app/icons/Users'
import { useRouter } from 'next/navigation'
import Bin from '../app/icons/Bin'
import axios from 'axios'
import { toast } from 'react-toastify'
const BASE_URL=process.env.NEXT_PUBLIC_API_URL
interface CardProps{
  id:number,
  name:string,
  members:[]
  owner:number,
  userId:number
  setRerender:React.Dispatch<React.SetStateAction<number>>;
}
function Card({id,name,members,owner,userId,setRerender}:CardProps) {

  const router= useRouter()

  const handleClick=async()=>{
     router.push(`/canvas/${id}`)
  }
const handleDelete = async () => {
  try {
    const token=localStorage.getItem('authToken')
    const res = await axios.delete(`${BASE_URL}/room/${id}`,{
      headers:{
        Authorization:`Bearer ${token}`
      }
    });
    setRerender(prev=>prev+1)
    toast.success('Room deleted successfully')    
  } catch (err) {
    console.error("Error deleting room");
  }
};

  return (
    <div key={id} onClick={handleClick}>
    <div className="group bg-gray-900 rounded-xl overflow-hidden border border-gray-800 transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/50 hover:border-gray-700 cursor-pointer relative">
      <div className="h-40 bg-[#48488E]" ></div>
      <div className="p-4 flex justify-between items-center">
        <span className="font-medium text-white">{name}</span>
        <div className="flex items-center gap-2 text-gray-500 text-sm">
          <Users/>
          <span className='text-gray-600'>{members}</span>
        </div>
      </div>
      {owner==userId &&
      <div className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <div onClick={(e) => {
                e.stopPropagation();
                handleDelete();
              }}><Bin/></div>
      </div>}
 </div>
</div>
  )
}

export default Card