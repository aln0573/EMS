import Employees from "../models/Employees.js"
import path from 'path'
import fs from 'fs'

export const addEmployee = async (req ,res) => {
    try {
        const {name , email, phone, designation, salary } = req.body

        if(!name) return res.status(400).json({message: "Name is required!"})
        if(!email) return res.status(400).json({message: "Email is required!"})

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if(!emailRegex.test(email)){
            return res.status(400).json({message: "Invalid email format"})
        }

        const existingEmail = await Employees.findOne({email})
        if(existingEmail){
            return res.status(400).json({message: "Employee with this email already exists"})
        }

        if(salary && isNaN(salary)){
            return res.status(400).json({message: "Salary must be a number"})
        }

         const profilePic = req.file ? req.file.filename : null

        const employee = new Employees({
            name,
            email,
            phone,
            designation,
            salary,
            profilePic
        })
        await employee.save()

        res.status(201).json({ message: "Employee added successfully", employee })
    } catch (error) {
        console.error("Error adding employee:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}



