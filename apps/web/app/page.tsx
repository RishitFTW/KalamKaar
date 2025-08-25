"use client"
import { useRouter } from "next/navigation";
import { useEffect } from "react";


export default function Home() {
  const router= useRouter()
  useEffect(()=>{
    const token=localStorage.getItem('authToken')
      token ?
       (router.push('/dashboard')):
       ( router.push('/signup'))
  },[]) 

  return (
    <></>
  );
}
