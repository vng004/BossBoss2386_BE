import bodyParser from 'body-parser'
import express from 'express'
import mongoose from 'mongoose'
import 'dotenv/config'
import cors from 'cors'
import { router } from './src/routes/index.js'
const { PORT, URI_MG } = process.env
import cookieParser from 'cookie-parser';

const app = express()

app.use(bodyParser.json())
app.use(cors({
    origin: 'http://localhost:5173', 
    credentials: true
}));
app.use(cookieParser());

mongoose.connect(URI_MG).then(() => {
    console.log("Connect MongoDB is successfully!")
})

router(app)

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT} `)
})