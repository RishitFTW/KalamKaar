"use client"
import axios from 'axios'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { toast } from 'react-toastify'

function Signin() {
    const [email, setEmail]= useState("")
    const [password, setPassword]= useState("")
    const router= useRouter();
    const handleSubmit=async(e:React.FormEvent)=>{
        e.preventDefault();
        const res=await axios.post('http://localhost:3001/api/v1/auth/signin',
              {email,password}
            )
        const data= res.data;
        localStorage.setItem('authToken',data.token) 
        toast.success('Logged in')
        router.push('/dashboard')

    }
  return (
<div className="w-full h-screen flex justify-center items-center bg-black">
  <form
    onSubmit={handleSubmit}
    className="flex flex-col gap-4 bg-white p-8 rounded-2xl shadow-lg w-80"
  >
    <h2 className="text-2xl font-semibold text-center text-black">Login</h2>

    <input
      value={email}
      type="text"
      placeholder="Enter email"
      onChange={(e) => setEmail(e.target.value)}
      className="border border-black rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
    />

    <input
      type="password"
      value={password}
      placeholder="Enter password"
      onChange={(e) => setPassword(e.target.value)}
      className="border border-black rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
    />

    <button
      type="submit"
      className="bg-black text-white py-2 rounded-lg hover:bg-gray-900 transition"
    >
      Submit
    </button>
    <p className="text-sm text-center text-gray-700">
      Don’t have an account?{" "}
      <span onClick={()=>{router.push('/signup')}} className="text-black font-semibold cursor-pointer hover:underline">
        Signup
      </span>
    </p>    
  </form>
</div>

  )
}

export default Signin