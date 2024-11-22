const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    displayName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    photoURL: {
        type: String,
        required: false
    }

}, {
    timestamps: true
})

const User = mongoose.model('User', userSchema)
module.exports = User;