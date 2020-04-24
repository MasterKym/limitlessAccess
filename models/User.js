const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      min: 3
    },
    phone: {
      type: String,
      required: true,
      min: 10,
      max: 10
    },
    city: {
      type: String,
      required: true,
      max: 40
    },

    date_created: {
      type: Date,
      default: Date.now
    }
  });

module.exports = mongoose.model("User", userSchema)