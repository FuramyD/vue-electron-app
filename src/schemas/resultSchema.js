const mongoose = require('mongoose')

export const resultSchema = mongoose.Schema({
    id: Number,
    name: String,
    tries: Number,
    scriptId: Number,
    lastEnter: String
})

export const resultModel = mongoose.model('Result', resultSchema)