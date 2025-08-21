import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

interface ModalProps {
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
}
function Modal({setModal}:ModalProps) {
    const router= useRouter()
   const [name,setName]= useState("")

   const handleClick=async(e:React.FormEvent)=>{
    e.preventDefault();
    const token= localStorage.getItem('authToken')
    const res=await axios.post("http://localhost:3001/api/v1/room/createRoom",{name},
      {
        headers:{
          Authorization:`Bearer ${token}`
        }
      }
    )
    console.log(res.data)
    if(res.data.roomId){
      const roomId=res.data.roomId
      router.push(`/canvas/${roomId}`)
    }
   }

  return (
<div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
  <form onSubmit={handleClick} className="bg-[#0f172a] text-white rounded-lg shadow-xl w-[480px] p-6">

    <h2 className="text-xl font-semibold">Create New Drawing</h2>
    <p className="text-sm text-gray-400 mt-1">Enter a title for your new drawing.</p>

    <label htmlFor="docName" className="block mt-5 text-sm font-medium text-gray-300">
      Enter Document name:
    </label>
    <input
      type="text"
      id="docName"
      value={name}
      onChange={(e)=>{setName(e.target.value)}}
      placeholder="Type here..."
      className="mt-2 w-full rounded-md bg-[#1e293b] border border-gray-600 px-3 py-2 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />

    
    <div className="flex justify-end gap-3 mt-6">
      <button
      onClick={()=>setModal(false)}
        className="px-5 py-2 rounded-md border border-gray-600 text-sm font-medium text-gray-300 hover:bg-gray-800 transition"
      >
        Cancel
      </button>
      <button type='submit'
        className="px-5 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-sm font-medium transition"
      >
        Confirm
      </button>
    </div>
  </form>
</div>

  )
}

export default Modal
