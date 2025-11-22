import express from 'express'
import { protectedRoute } from '../middlewares/auth.middleware.js'
import { adminOnly } from '../middlewares/admin.middleware.js'
import { addEmployee,} from '../controllers/admin.controller.js'
import upload from '../middlewares/multer.js'

const router = express.Router()

router.post("/employees", protectedRoute, adminOnly, upload.single("profilePic"), addEmployee)


export default router