import mongoose from 'mongoose'

const employeeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    phone: {
        type: Number,
        trim: true
    },
    designation: {
        type: String,
        required: true,
        enum: ["Manager", "Developer", "Designer", "HR", "Accountant", "Other"],
        default: "Other"
    },
    salary: {
        type: Number,
    },
    profileImage: {
        type: String,
        default: null
    },
},{timestamps: true})

const Employees = mongoose.model('Employees', employeeSchema)
export default Employees
