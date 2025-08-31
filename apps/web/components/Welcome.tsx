import React from 'react'
import Button from './Button'
import Add from '../app/icons/Add'

interface ModalProps {
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
  setType:React.Dispatch<React.SetStateAction<"join" | "create">>;
}


function Welcome({setModal,setType}:ModalProps) {

  return (
        <section className="bg-[#191D28] border border-gray-800 rounded-xl p-8 text-center py-10 mb-12">
            <h2 className="text-3xl font-bold mb-2 text-white">Welcome back !</h2>
            <p className="text-gray-400 pb-6">Ready to create something new?</p>
            <div className='flex items-center justify-center'>
             <Button variant="secondary" text="Start a New Canvas" icon={<Add/>} onClick={()=>{setType("create"); setModal(true)}}/>
            </div>
            
        </section>        

  )
}

export default Welcome