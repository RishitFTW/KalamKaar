"use client"
import React, { useEffect, useState } from 'react'
import Card from '../../components/Card'
import Welcome from '../../components/Welcome'
import Navbar from '../../components/Navbar'
import Add from '../icons/Add'
import axios from 'axios'
import Modal from '../../components/Modal'
import { useRouter } from 'next/navigation'


function page() {
 const [rooms, setRooms]=useState([]);
 const [modal, setModal]=useState(false);
 const [userId, setUserId]= useState<number | null>(null);
 const [render,setRerender]=useState(1);
 const router=useRouter();
 useEffect(()=>{
  const token= localStorage.getItem('authToken')
  if(!token){
    router.push('/')
  }
   const f=async()=>{
    const res=await axios.get('http://localhost:3001/api/v1/room',{
      headers:{
        Authorization:`Bearer ${token}`
      }
    })
    const data= res.data;
    console.log(data)
    setRooms(data.rooms)
    setUserId(data.userId)
   }
   f()
 },[render])

  return (
    <div className="w-screen min-h-screen bg-black">
      <div>
        <Navbar/>
      </div>
      <div className='px-8'>
      <div className='pt-10'>
        <Welcome setModal={setModal}/>
      </div>
      <h3 className="text-2xl font-bold mb-6 text-white">All Your Drawings</h3>   
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
          <div className="flex flex-col justify-center items-center gap-2 rounded-xl border-2 border-dashed border-gray-800 text-gray-500 transition-all duration-200 hover:border-teal-500 hover:text-teal-400 hover:bg-gray-900/50 cursor-pointer min-h-[226px]">
              <div className=''><Add/></div>
              <div onClick={()=>{setModal(true)}} className="font-medium">New Drawing</div>
          </div>         
      </div> 
      </div>
      {modal && <Modal setModal={setModal}/>}
    </div>
    
  )
}

export default page