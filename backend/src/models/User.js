import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
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
    password: {
        type: String,
        required: true,
        minLength: 6
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
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    }
},{timestamps: true})

const User = mongoose.model('User', userSchema)
export default User