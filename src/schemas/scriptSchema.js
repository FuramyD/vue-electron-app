const mongoose = require('mongoose')

export const scriptSchema = mongoose.Schema({
    id: Number,
    script: String,
    time: Number
})

export const scriptModel = mongoose.model('Script', scriptSchema)