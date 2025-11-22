import express from 'express'
import 'dotenv/config'
import authRouter from './routes/auth.routes.js'
import adminRoute from './routes/admin.routes.js'
import cookieParser from 'cookie-parser'
import { connectDB } from './config/db.js'

const app = express()
const PORT = process.env.PORT

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())

app.use("/api/auth", authRouter)
app.use("/api", adminRoute)

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
    connectDB()
})