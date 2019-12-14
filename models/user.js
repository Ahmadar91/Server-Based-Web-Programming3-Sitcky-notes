const mongoose = require('mongoose')

const Schema = mongoose.Schema

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    minlength: 3
  },
  password: {
    type: String,
    required: true,
    minlength: 5
  }
})
userSchema.path('password').validate(function (password) {
  return password.length >= 5
}, 'the Password must be of minimum of 5 ')
module.exports = mongoose.model('User', userSchema)
