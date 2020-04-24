const express = require('express');
const User = require('../models/User')

const userValidationSchema = require('./validations/userValidationSchema')

const userRouter = express.Router();

userRouter.post("", async (req, res) => {
    console.log(req.body)
    try{
        const { error, value } = userValidationSchema.validate({
            name: req.body.name,
            phone: req.body.phone,
            city: req.body.city
        });
        if(error){
            return res.status(400).json(error.details[0].message);
        }
    } catch(error){
        console.log("Validation Error")
        console.log(error)
    }


    try {
    const userExist = await User.findOne({
        name: req.body.name
      });
    const phoneExist = await User.findOne({
        phone: req.body.phone
      });

    if(userExist || phoneExist){
        return res.status(409).json("The information you entered already exist");
    }
    } catch(error){
        console.log("Error while checkinf if user already exists")
    }
  
    try {
        const user = new User({
            name: req.body.name,
            phone: req.body.phone,
            city: req.body.city
        })
        console.log("Reached account creation in DB")
        const savedUser = await user.save()

        return res.status(200).json(savedUser)
    } catch(error){
        console.log(error)
        return res.status(500).send(error)
    }
});


module.exports = userRouter;