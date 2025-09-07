import express from 'express'
import AuthRouter from './routes/auth.routes'
import roomRouter from './routes/room.routes'
import cors from 'cors'
import chatRouter from './routes/chat.routes';
import dotenv from 'dotenv'

const app=express();
app.use(cors({
  origin: "https://kalam-kaar-web.vercel.app",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true
}));
app.use(express.json())
dotenv.config()

app.use('/api/v1/auth',AuthRouter)
app.use('/api/v1/room',roomRouter);
app.use('/api/v1/chat',chatRouter)

app.listen(process.env.PORT);