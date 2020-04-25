const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    
  // Personal info fields
  firstName: {
      type: String,
      required: true,
      min: 3,
      max: 20
    },

    lastName: {
      type: String,
      required: true,
      min: 3,
      max: 20
    },

    studyNumber:{
      type: String,
      required: true,
      max:12
    },

    school:{
      type: String,
      required: true,
      max: 20
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

    // student Card fields
    cardPhotos: [
      {
        data: {
          type: Buffer,
          required: true
        },
        mimeType: {
          type: String,
          required: true
        }
      }
    ],

    // Automatically generated fields
    date_created: {
      type: Date,
      default: Date.now
    }
  });

module.exports = mongoose.model("Student", userSchema)