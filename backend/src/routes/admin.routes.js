import express from 'express'
import { protectedRoute } from '../middlewares/auth.middleware.js'
import { adminOnly } from '../middlewares/admin.middleware.js'
import { addEmployee, deleteEmployee, editEmployee, getDesignations, getEmployeeById, getEmployees,  } from '../controllers/admin.controller.js'
import upload from '../middlewares/multer.js'

const router = express.Router()

router.get("/designations", protectedRoute, adminOnly, getDesignations);
router.get("/employees/:id", protectedRoute, adminOnly, getEmployeeById);
router.get("/employees", protectedRoute, adminOnly, getEmployees)
router.post("/employees", protectedRoute, adminOnly, upload.single("profileImage"), addEmployee)
router.put("/employees/:id", protectedRoute, adminOnly, upload.single("profileImage"), editEmployee)
router.delete("/employees/:id", protectedRoute, adminOnly, deleteEmployee)


export default router