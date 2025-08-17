import express from 'express'
import { JWT_secret } from "@repo/backend-common/config"
const app=express();

app.get('/',(req,res)=>{
    res.send({secret:JWT_secret})
})
app.post('/signup',async(req,res)=>{})
app.post('/signin',async(req,res)=>{})
app.post('/createRoom',async()=>{});

app.listen(3001);