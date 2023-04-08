import express from 'express'
const router = express.Router()
import { createUser , createBlog, createComment , allBlogsByUser , allCommentsByUserOnBlog , Final } from '../controllers/userController.js'

router.route('/user/:userId/level/:levelno').get(Final)
router.route('/user').post(createUser)
router.route('/blog').post(createBlog).get(allBlogsByUser)
router.route('/comment').post(createComment).get(allCommentsByUserOnBlog)





export default router