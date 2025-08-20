import express from 'express'
import AuthRouter from './routes/auth.routes'
import roomRouter from './routes/room.routes'
import cors from 'cors'

const app=express();
app.use(cors());
app.use(express.json())

app.use('/api/v1/auth',AuthRouter)
app.use('api/v1/room',roomRouter);

app.listen(3001);