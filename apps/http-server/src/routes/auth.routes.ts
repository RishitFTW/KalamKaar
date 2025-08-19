import { Router} from 'express'
const AuthRouter:Router= Router()

AuthRouter.post('/signin')
AuthRouter.post('/signup')

export default AuthRouter;