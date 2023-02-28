import { Router } from 'express'
import content from '../middleware/content.js'
import admin from '../middleware/admin.js'
import * as upload from '../middleware/upload.js'
import { jwt } from '../middleware/auth.js'
import { createBoardgame, editBoardgame, getAllBoardgames, getBoardgame, getPostBoardgames, deleteBoardgame } from '../controllers/boardgames.js'

const router = Router()

router.post('/', content('multipart/form-data'), jwt, admin, upload.boardgameImg, createBoardgame)
router.get('/', getPostBoardgames)
router.get('/all', jwt, admin, getAllBoardgames)
router.get('/:id', getBoardgame)
router.patch('/delete/:id', content('application/json'), jwt, admin, deleteBoardgame)
router.patch('/:id', content('multipart/form-data'), jwt, admin, upload.boardgameImg, editBoardgame)

export default router
