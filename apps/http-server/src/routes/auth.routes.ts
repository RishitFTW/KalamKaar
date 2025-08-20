import { Router} from 'express'
import { createUser, userSignin } from '../controllers/user.controllers';
const AuthRouter:Router= Router()

AuthRouter.post('/signin',userSignin)
AuthRouter.post('/signup',createUser)

export default AuthRouter;