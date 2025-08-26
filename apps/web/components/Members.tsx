
  import React from 'react'
interface Member{
  id:string,
  username:string
}
interface MemberProps{
  members?:Member[]
}
  function Members({members=[]}:MemberProps) {
    return (
 <div className="w-28 bg-gray-800 text-white rounded-lg p-4 border border-gray-700">

  <h2 className="text-sm font-semibold mb-2 border-b border-gray-700 pb-2">Members</h2>


  <div className="flex items-center justify-between mt-2">
    <div className="flex items-center gap-3">

      <div className='flex flex-col gap-2'>
      {members.map((member)=>{
      return<div key={member.id} className='flex items-center justify-center gap-x-1'>
             <div className="text-sm w-full font-medium">{member.username}</div>
                 <div className="w-2 h-2 rounded-full bg-gray-500"></div>
          </div>  
      })}
      </div>
    </div>
  </div>

</div>

    )
  }

  export default Members