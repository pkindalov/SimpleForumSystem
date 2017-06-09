const mongoose = require('mongoose')
const REQUIRED_VALIDATION_MESSAGE = '{PATH} is required'

let answersShema = new mongoose.Schema({
  answer: {type: String, required: REQUIRED_VALIDATION_MESSAGE},
  date: {type: Date, default: Date.now()}
})

let Answer = mongoose.model('Comment', answersShema)

module.exports = Answer
