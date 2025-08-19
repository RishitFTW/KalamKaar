import express from 'express'
import { JWT_secret } from "@repo/backend-common/config"
import jwt from 'jsonwebtoken'
import { CreateUserSchema,SignInSchema,CreateRoomSchema } from '@repo/common/types'
import { prisma } from "@repo/db/client"
import { middleware } from './middleware'
const app=express();
app.use(express.json())

// app.post('/signup',async(req,res)=>{
//     const userData=req.body;
//     const result=CreateUserSchema.safeParse(userData)
//     if(!result.success){
//         console.log(result)
//         res.json({
//             message:"Incorrect inputs"
//         })
//         return;
//     }
//     const user=await prisma.user.create({
//         data:{  email:result.data.email,
//                 name:result.data.name,
//                 password:result.data.password
//         }
//     })
//     res.status(201).json({
//       message: "User created successfully",
//       user,
//     });    
// })
// app.post('/signin',async(req,res)=>{
//   const user = req.body;

//   const parsed = SignInSchema.safeParse(user);
//   if (!parsed.success) {
//     return res.status(400).json({
//       message: "Incorrect inputs",
//       errors: parsed.error.format(),
//     });
//   }

//   const userData = await prisma.user.findFirst({
//     where: { email: user.email },
//   });

//   if (!userData) {
//     return res.status(404).json({ message: "User doesn’t exist" });
//   }

//   if (user.password !== userData.password) {
//     return res.status(401).json({ message: "Invalid password" });
//   }

//   const token = jwt.sign(
//     { id: userData.id, email: userData.email },
//     JWT_secret,
//     { expiresIn: "1h" }
//   );

//   return res.json({
//     message: "Login successful",
//     token,
//   });
// })
// app.post('/createRoom',middleware,async(req,res)=>{
//     const room=req.body;
//     const parsed= CreateRoomSchema.safeParse(room)
//     if(!parsed.success){
//         res.json({
//             message:"Incorrect inputs"
//         })
//         return;        
//     }    
//     //@ts-ignore
//     const userId= req.userId
//     const roomData= await prisma.room.create({
//         data:{
//             slug:parsed.data.name,
//             adminId:userId
//         }
//     })
//      res.json({
//         roomId: roomData.id
//        })
// });

app.listen(3001);