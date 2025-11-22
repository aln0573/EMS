import bcrypt  from 'bcrypt'
import User from '../models/User.js'
import jwt from 'jsonwebtoken'

export const Register = async (req, res) => {
    try {
        console.log("Data")
        const { name , email , password } = req.body

        if(!name || !email || !password){
            return res.status(400).json({message: "All fields are required!"})
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if(!emailRegex.test(email)){
            return res.status(400).json({message: "Invalid email format"})
        }

        const existingUser = await User.findOne({email})
        if(existingUser){
            return res.status(400).json({message: "User already exists"})
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



export const Login = async (req ,res) => {
    try {
        const { email , password } = req.body
        
        if(!email || !password) {
            return res.status(400).json({message: "All fields are required"})
        }

        const user = await User.findOne({email})
        if(!user){
            return res.status(400).json({message: "User not found"})
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch){
            return res.status(400).json({message: "Invalid credentials"})
        }

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {
            expiresIn: "7d"
        })

        res.cookie("jwt", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        res.status(200).json({message: "Login Successfull", user: {
            _id: user._id,
            name: user.name,
            email: user.email
        }})
    } catch (error) {
        console.error("Error in Login Controller:", error.message)
        res.status(500).json({ message: "Internal server error" })
    }
}


export const logout = (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict"
    });

    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};
