"use client"
import React, { useEffect, useState } from 'react'
import Card from '../../components/Card'
import Welcome from '../../components/Welcome'
import Navbar from '../../components/Navbar'
import Add from '../icons/Add'
import axios from 'axios'
import Modal from '../../components/Modal'
import { useRouter } from 'next/navigation'
import Loader from '../../components/Loader'
const BASE_URL=process.env.NEXT_PUBLIC_API_URL

function page() {
 const [rooms, setRooms]=useState([]);
 const [modal, setModal]=useState(false);
 const [userId, setUserId]= useState<number | null>(null);
 const [render,setRerender]=useState(1);
 const [loading, setLoading]=useState(true)
 const [type,setType]=useState<"join" | "create">("create")

 const router=useRouter();
 useEffect(()=>{
  const token= localStorage.getItem('authToken')
  if(!token){
    router.push('/')
  }
   const f=async()=>{
    const res=await axios.get(`${BASE_URL}/room`,{
      headers:{
        Authorization:`Bearer ${token}`
      }
    })
    const data= res.data;
    setRooms(data.rooms)
    setUserId(data.userId)
    setLoading(false)
   }
   f()
 },[render])

  if(loading){
    return <Loader/>
  }

  return (
    <div className="w-screen min-h-screen bg-black">
      <div>
        <Navbar setModal={setModal} setType={setType}/>
      </div>
      <div className='px-8'>
      <div className='pt-10'>
        <Welcome setModal={setModal} setType={setType}/>
      </div>
      <h3 className="text-xl font-bold mb-4 text-white">All Your Rooms</h3>   
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {rooms.map((room: any) => (
          userId !== null && (
            <Card
              key={room.id}
              id={room.id}
              name={room.slug}
              members={room.members.length}
              owner={room.admin.id}
              userId={userId}
              setRerender={setRerender}
            />
          )
        ))}
          <div onClick={()=>{setModal(true); setType("create")}} 
           className="flex flex-col justify-center items-center gap-2 rounded-xl border-2 border-dashed border-gray-800 text-gray-500 transition-all duration-200 hover:border-[#48488E] hover:text-[#48488E] hover:bg-gray-900/50 cursor-pointer min-h-[226px]">
              <div className=''><Add/></div>
              <div className="font-medium">New Room</div>
          </div>         
      </div> 
      </div>
      {modal && <Modal setModal={setModal} type={type}/>}
    </div>
    
  )
}

export default page