const mongoose = require('mongoose')
const REQUIRED_VALIDATION_MESSAGE = '{PATH} is required'

let commentsShema = new mongoose.Schema({
  comment: {type: String, required: REQUIRED_VALIDATION_MESSAGE},
  date: {type: Date, default: Date.now()}
})

let Comment = mongoose.model('Comment', commentsShema)

module.exports = Comment
