import React from 'react'
import Button from './Button'
import Logo from '../app/icons/Logo'
import Link from '../app/icons/Link'
interface ModalProps {
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
  setType:React.Dispatch<React.SetStateAction<"join" | "create">>;
}

function Navbar({setModal,setType}:ModalProps) {
  
  return (
    <div className=' h-[90px] flex items-center justify-center border-b border-gray-600'>
        <div className='pl-7 pt-1 flex-1'>
            <div className='flex items-center '>
            <Logo/>
            <div className='flex justify-center items-center font-bold text-2xl pl-3 text-white'>WanderInk</div>
            </div>

        </div>
        <div className='flex-1'>
          <div className='flex items-center justify-center gap-4 pl-[468px]'>
            <Button variant='primary' text="Join" icon={<Link/>}  onClick={()=>{setType("join"); setModal(true)}}></Button>
             <div className="w-10 h-10 rounded-full bg-teal-500 flex items-center justify-center font-bold text-black flex-shrink-0">R</div>
          </div>
            
        </div>
    </div>
  )
}

export default Navbar