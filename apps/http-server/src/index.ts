import express from 'express'
import { JWT_secret } from "@repo/backend-common/config"
import { CreateUserSchema,SignInSchema,CreateRoomSchema } from '@repo/common/types'
const app=express();

app.get('/',(req,res)=>{
    res.send({secret:JWT_secret})
})
app.post('/signup',async(req,res)=>{
    const user=req.body;
    const data=CreateUserSchema.safeParse(user)
    if(!data.success){
        res.json({
            message:"Incorrect inputs"
        })
        return;
    }
})
app.post('/signin',async(req,res)=>{
    const user=req.body;
    const data= SignInSchema.safeParse(user)
    if(!data.success){
        res.json({
            message:"Incorrect inputs"
        })
        return;        
    }
})
app.post('/createRoom',async(req,res)=>{
    const room=req.body;
    const data= CreateRoomSchema.safeParse(room)
    if(!data.success){
        res.json({
            message:"Incorrect inputs"
        })
        return;        
    }    
});

app.listen(3001);