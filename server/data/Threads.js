const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId
const REQUIRED_VALIDATION_MESSAGE = '{PATH} is required}'

let threadSchema = new mongoose.Schema({
  title: {type: String, required: REQUIRED_VALIDATION_MESSAGE},
  description: {type: String},
  date: {type: Date, default: Date.now()},
  answers: {type: ObjectId, required: REQUIRED_VALIDATION_MESSAGE, ref: 'Answers'}
})

let Thread = mongoose.model('Thread', threadSchema)

module.exports = Thread
