import { Router } from 'express'
import content from '../middleware/content.js'
import { jwt } from '../middleware/auth.js'
import * as upload from '../middleware/upload.js'
import admin from '../middleware/admin.js'
import { createTeamup, getAllTeamups, getTeamup, joinOrCancelTeamup, editTeamup, deleteTeamup, getMyTeamup } from '../controllers/teamups.js'

const router = Router()

router.post('/', content('multipart/form-data'), jwt, upload.boardgameImg, createTeamup)

router.get('/all', getAllTeamups)

router.get('/member', jwt, getMyTeamup)

router.get('/:id', getTeamup)
router.post('/:id', jwt, joinOrCancelTeamup)
router.patch('/delete/:id', jwt, admin, deleteTeamup) // admin 刪除揪團
router.patch('/delete/member/:id', jwt, deleteTeamup) // 會員刪除自己揪團
router.patch('/:id', content('multipart/form-data'), jwt, upload.boardgameImg, admin, editTeamup)

export default router
