const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId
// const REQUIRED_VALIDATION_MESSAGE = '{PATH} is required'

let answersShema = new mongoose.Schema({
  answer: {type: String},
  date: {type: Date, default: Date.now()},
  thread: {type: ObjectId, ref: 'Threads'},
  author: {type: ObjectId, ref: 'User'},
  authorName: {type: String}
})

let Answer = mongoose.model('Answer', answersShema)

module.exports = Answer
