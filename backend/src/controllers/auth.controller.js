import bcrypt  from 'bcrypt'
import User from '../models/User.js'

export const Register = async (req, res) => {
    try {
        const { name , email , password } = req.body

        if(!name || !email || !password){
            return res.status(400).json({message: "All fields are required!"})
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if(!emailRegex.test(email)){
            return res.status(400).json({message: "Invalid email format"})
        }

        if(password.length < 6) {
            return res.status(400).json({message: "Password should be at least 6 characters"})
        } 

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new User({
            name,
            email,
            password: hashedPassword
        })

        await newUser.save()

        res.status(201).json({message: "Registered Successfully", user: {
            _id: newUser._id,
            name: newUser.name,
            email: newUser.email
        }})
    } catch (error) {
        console.error('Error in Register Controler', error.message);
        res.status(500).json({message: "Internal server error"})
    }
}