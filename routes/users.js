import { Router } from 'express'
import content from '../middleware/content.js'
import * as auth from '../middleware/auth.js'
import admin from '../middleware/admin.js'
import { register, login, logout, extend, getMyself, editMyself, getAllUser, editUser, deleteUser } from '../controllers/users.js'

const router = Router()

router.post('/', content('application/json'), register) // 註冊
router.post('/login', content('application/json'), auth.login, login) // 登入
router.delete('/logout', auth.jwt, logout) // 登出
router.patch('/extend', auth.jwt, extend) // 過期 JWT 換新 JWT
router.get('/myself', auth.jwt, getMyself) // 取自己的資料
router.get('/allusers', auth.jwt, admin, getAllUser) // 取全部使用者的資料
router.patch('/edituser', auth.jwt, admin, editUser) // 改使用者的資料
router.patch('/deleteuser/:id', auth.jwt, admin, deleteUser) // admin 刪除會員資料
router.patch('/editmyself', auth.jwt, editMyself) // 改自己的資料

export default router
