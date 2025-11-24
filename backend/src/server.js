import express from 'express'
import 'dotenv/config'
import authRouter from './routes/auth.routes.js'
import adminRoute from './routes/admin.routes.js'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { connectDB } from './config/db.js'
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const app = express()
const PORT = process.env.PORT

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadsPath = path.join(__dirname, "..", "uploads");
const employeeUploads = path.join(uploadsPath, "employees");

if (!fs.existsSync(employeeUploads)) {
    fs.mkdirSync(employeeUploads, { recursive: true });
}

app.use("/uploads", express.static(uploadsPath));

console.log("Serving static files from:", uploadsPath);
console.log("Employee uploads:", employeeUploads);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use("/api/auth", authRouter);
app.use("/api", adminRoute);

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    connectDB();
});