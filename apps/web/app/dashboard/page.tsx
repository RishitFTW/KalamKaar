import React from 'react'
import Card from '../../components/Card'
import Welcome from '../../components/Welcome'
import Navbar from '../../components/Navbar'
import Button from '../../components/Button'
import Add from '../icons/Add'


function page() {
  return (
    <div className="w-screen min-h-screen bg-black">
      <div>
        <Navbar/>
      </div>
      <div className='px-8'>
      <div className='pt-10'>
        <Welcome/>
      </div>
      <h3 className="text-2xl font-bold mb-6 text-white">All Your Drawings</h3>   
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
         <Card/>
         <Card/>
         <Card/>
          <div className="flex flex-col justify-center items-center gap-2 rounded-xl border-2 border-dashed border-gray-800 text-gray-500 transition-all duration-200 hover:border-teal-500 hover:text-teal-400 hover:bg-gray-900/50 cursor-pointer min-h-[226px]">
              <div className=''><Add/></div>
              <div className="font-medium">New Drawing</div>
          </div>         
      </div> 
      </div>
    </div>
  )
}

export default page