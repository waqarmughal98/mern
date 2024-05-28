const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
  },
email: {
    type: String,
    required: [true, 'Email is required'],
    unique: [true, 'User with this email is already exists'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
  },
  otp:{
    type:String
  }
});

const User = mongoose.model("user", UserSchema)

module.exports = User
