import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from 'dotenv'

const app = express();
app.use(cors());
dotenv.config()

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        app.listen(process.env.PORT, () => {
            console.log(`Server Running On Port: ${process.env.PORT}`)
        })
    } catch (err) {
        console.error(`Connection Failed!`, err.message)
    }
}
connectDB().then(() => {
    mongoose.connection.on('open', () => {
        console.log("Connected!")
    })
    mongoose.connection.on('error', (err) => {
        console.log(err)
    })
});

