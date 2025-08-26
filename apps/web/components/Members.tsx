
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
 <div className="w-64 bg-gray-800 text-white rounded-lg p-4 border border-gray-700">

  <h2 className="text-sm font-semibold mb-2 border-b border-gray-700 pb-2">Members</h2>


  <div className="flex items-center justify-between mt-2">
    <div className="flex items-center gap-3">

      <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-white font-medium">
        R
      </div>
      {members.map((member)=>{
      return <div key={member.id}>
        <p className="text-sm font-medium">{member.username}</p>
      </div>
      })}

    </div>

    <div className="w-3 h-3 rounded-full bg-green-500"></div>
  </div>

</div>

    )
  }

  export default Members