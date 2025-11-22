import express from 'express'
import { protectedRoute } from '../middlewares/auth.middleware.js'
import { adminOnly } from '../middlewares/admin.middleware.js'
import { addEmployee, deleteEmployee, editEmployee,  } from '../controllers/admin.controller.js'
import upload from '../middlewares/multer.js'

const router = express.Router()

router.post("/employees", protectedRoute, adminOnly, upload.single("profilePic"), addEmployee)
router.put("/employees/:id", protectedRoute, adminOnly, upload.single("profilePic"), editEmployee)
router.delete("/employees/:id", protectedRoute, adminOnly, deleteEmployee)


export default router