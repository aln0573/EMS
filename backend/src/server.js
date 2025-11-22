import express from 'express'
import 'dotenv/config'
import authRouter from './routes/auth.routes.js'
import { connectDB } from './config/db.js'

const app = express()
const PORT = process.env.PORT

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use("/api/auth", authRouter)

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
    connectDB()
})