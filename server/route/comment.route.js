import express from 'express'
import { createComment, updateComment, getComments, deleteComment } from '../controllers/comment.controller.js'
import { authMiddleware } from '../Middleware/auth.middleware.js'

const router = express.Router()

router.post('/createComment', authMiddleware, createComment)

router.put('/updateComment', authMiddleware, updateComment)

router.get('/getComments', authMiddleware, getComments)

router.delete('/deleteComment', authMiddleware, deleteComment)

export default router

