import express from 'express'
import AuthRouter from './routes/auth.routes'
import roomRouter from './routes/room.routes'
import cors from 'cors'
import chatRouter from './routes/chat.routes';

const app=express();
app.use(cors());
app.use(express.json())

app.use('/api/v1/auth',AuthRouter)
app.use('/api/v1/room',roomRouter);
app.use('/api/v1/chat',chatRouter)

app.listen(3001);