"use client"
import axios from 'axios'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
const BASE_URL=process.env.NEXT_PUBLIC_API_URL
function Signup() {
    const [email, setEmail]= useState("")
    const [password, setPassword]= useState("")
    const [name, setName]= useState("")
    const router= useRouter();
    const handleSubmit=async(e:React.FormEvent)=>{
        e.preventDefault();
        const res=await axios.post(`${BASE_URL}/auth/signup`,
              {email,password,name}
            )
        const data= res.data;
        localStorage.setItem('authToken',data.token) 
        router.push('/dashboard')

    }
  return (
<div className="w-full h-screen flex justify-center items-center bg-black">
  <form
    onSubmit={handleSubmit}
    className="flex flex-col gap-4 bg-white p-8 rounded-2xl shadow-lg w-80"
  >
    <h2 className="text-2xl font-semibold text-center text-black">Signup</h2>

    {/* Name Input */}
    <input
      type="text"
      value={name}
      placeholder="Enter name"
      onChange={(e) => setName(e.target.value)}
      className="border border-black rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
    />

    {/* Email Input */}
    <input
      value={email}
      type="text"
      placeholder="Enter email"
      onChange={(e) => setEmail(e.target.value)}
      className="border border-black rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
    />

    {/* Password Input */}
    <input
      type="password"
      value={password}
      placeholder="Enter password"
      onChange={(e) => setPassword(e.target.value)}
      className="border border-black rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
    />

    {/* Submit Button */}
    <button
      type="submit"
      className="bg-black text-white py-2 rounded-lg hover:bg-gray-900 transition cursor-pointer"
    >
      Submit
    </button>
    <p className="text-sm text-center text-gray-700">
      Already have an account?{" "}
      <span onClick={()=>{router.push('/signin')}} className="text-black font-semibold cursor-pointer hover:underline">
        Signin
      </span>
    </p>     
  </form>
</div>


  )
}

export default Signup