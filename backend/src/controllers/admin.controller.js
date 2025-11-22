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



export const editEmployee = async (req , res) => {
    try {
        const id = req.params.id

        const { name, email, phone , designation , salary } = req.body

        const employee = await Employees.findById(id)
        if(!employee){
            return res.status(404).json({message: "Employee not found"})
        }


        if(email && email !== employee.email){
            const existingEmail = await Employees.findOne({email})
            if(existingEmail){
                return res.status(400).json({message: "Email already use by another employee"})
            }
        }


        if(req.file){
            if(employee.profilePic) {
                const oldPath = path.join("uploads/employees", employee.profilePic)
                if(fs.existsSync(oldPath)) {
                    fs.unlink(oldPath)
                }
            }
            employee.profilePic = req.file.filename
        }

        employee.name = name ?? employee.name
        employee.email = email ?? employee.email
        employee.phone = phone ?? employee.phone
        employee.designation = designation ?? employee.designation
        employee.salary = salary ?? employee.salary

        await employee.save()

        res.status(200).json({message: "Employee updated successfully", employee})
    } catch (error) {
        console.error("Error editing employee:", error);
        res.status(500).json({ message: "Internal server error" })
    }
}


export const deleteEmployee = async (req, res) => {
    try {
        const id = req.params.id
        const employee = await Employees.findById(id)

        if(!employee){
            return res.status(404).json({message: "Employee not found"})
        }

        if(employee.profilePic){
            const filePath = path.join("uploads/employees", employee.profilePic)
            if(fs.existsSync(filePath)) {
                fs.unlinkSync(filePath)
            }
        }

        await Employees.findByIdAndDelete(id)

        res.status(200).json({ message: "Employee deleted successfully" })

    } catch (error) {
        console.error("Error deleting employee:", error);
        res.status(500).json({ message: "Internal server error" })
    }
}


