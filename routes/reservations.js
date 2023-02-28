import { Router } from 'express'
import content from '../middleware/content.js'
import { jwt } from '../middleware/auth.js'
import admin from '../middleware/admin.js'
import { createReservation, getReservation, getAllReservations, editReservation, deleteReservation, getMyReservation } from '../controllers/reservations.js'

const router = Router()

router.post('/', content('application/json'), jwt, createReservation)
router.post('/getdate', content('application/json'), jwt, getReservation)

router.get('/all', jwt, admin, getAllReservations)
router.get('/getmyreservation', jwt, getMyReservation)

router.patch('/delete/:id', jwt, admin, deleteReservation)
router.patch('/delete/member/:id', jwt, deleteReservation)
router.patch('/:id', content('application/json'), jwt, admin, editReservation)

export default router
