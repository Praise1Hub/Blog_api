import express from 'express'
import { createPost, getPost, deletePost, updatePost } from '../controllers/post.controller'
import { authMiddleware } from '../Middleware/auth.middleware.js'

const router = express.Router()

router.post("/createPost", authMiddleware, createPost)

router.get("/getPost", authMiddleware, getPost)

router.delete("/deletePost", authMiddleware, deletePost)

router.put("/updatePost", authMiddleware, updatePost)

export default router




