import React from 'react'

function Loader() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black">
    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    <p className="mt-4 text-gray-200 font-medium">Loading..</p>
    </div>

  )
}

export default Loader
