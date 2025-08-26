import { toast } from "react-toastify"

export const handleCopy=(roomId:string)=>{ 
    navigator.clipboard.writeText(roomId)
    toast.success('RoomID copied to Clipboard')   
}