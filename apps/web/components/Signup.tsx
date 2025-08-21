"use client"
import axios from 'axios'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

function Signup() {
    const [email, setEmail]= useState("")
    const [password, setPassword]= useState("")
    const router= useRouter();
    const handleSubmit=async(e:React.FormEvent)=>{
        e.preventDefault();
        console.log(email)
        console.log(password)
        const res=await axios.post('http://localhost:3001/api/v1/auth/signin',
              {email,password}
            )
        const data= res.data;
        console.log("hogya")
        localStorage.setItem('authToken',data.token) 
        router.push('/canvas/1')

    }
  return (
    <div className='w-full h-full flex justify-center items-center'>
        <form onSubmit={handleSubmit} className='flex flex-col gap-2 bg-white p-3'>
            <input
            value={email}
            type="text"
            placeholder="Enter email"
            onChange={(e)=>{setEmail(e.target.value)}}
            className='border'
            />
            <input
            type="password"
            value={password}
            placeholder="Enter password"
            onChange={(e)=>{setPassword(e.target.value)}}
            className='border'
            />
            <button className='bg-gray-400 cursor-pointer'>Submit</button>
        </form>
    </div>
  )
}

export default Signup