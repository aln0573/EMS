import express from "express"
import { Login, logout, Register } from "../controllers/auth.controller.js"
import { protectedRoute } from "../middlewares/auth.middleware.js"
import { getDesignations, getEmployeeById, getEmployees } from "../controllers/admin.controller.js"

const router = express.Router()

router.post("/register", Register)
router.post("/login", Login)
router.post("/logout", logout)
router.get("/employees/:id", protectedRoute,  getEmployeeById);
router.get("/employees", protectedRoute, getEmployees)
router.get("/designations", protectedRoute, getDesignations);

export default router