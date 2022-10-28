import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from 'dotenv'
import bodyParser from "body-parser";
import routes from './routes/routes.js'
import killProcess from 'kill-port'

const app = express();
app.use(bodyParser.json({limit: "32mb", extended: true}));
app.use(bodyParser.urlencoded({limit: "32mb", extended: true}));
app.use(cors());
app.use('/', routes.userRoutes)

dotenv.config()

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        app.listen(process.env.PORT, () => {
            console.log(`Server Running On Port: ${process.env.PORT}`)
        }).on('error', async (e) => {
            console.log(e.code)
            if (e.code === "EADDRINUSE") {
                await mongoose.disconnect().then(async () => await killProcess(process.env.PORT, 'tcp'))
                return
            }
        })
    } catch (err) {
        console.error(`Connection Failed!`, err.message)
    }
}
connectDB()


