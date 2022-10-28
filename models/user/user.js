import mongoose from "mongoose";

const {Schema} = mongoose
const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        first: {
            type: String,
            trim: true
        },
        last: {
            type: String,
            trim: true
        }
    },
    email: {
        type: String,
        unique: true
    }
})

userSchema.virtual('fullName').get(() => {
    return `${this.name.first} ${this.name.last}`
})

export default mongoose.model('user', userSchema)