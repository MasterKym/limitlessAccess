const express = require('express');
const User = require('../models/Student')
const multer = require('multer')

const userValidationSchema = require('./validations/studentValidationSchema')

const userRouter = express.Router();

userRouter.post("/addstudent", async (req, res) => {
    console.log(req.body)
    try{
        const { error, value } = userValidationSchema.validate({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            studyNumber: req.body.studyNumber,
            school: req.body.school,
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
        studyNumber: req.body.studyNumber
      });
    const phoneExist = await User.findOne({
        phone: req.body.phone
      });

    if(userExist || phoneExist){
        return res.status(409).json("The information you entered already exists");
    }
    } catch(error){
        console.log("Error while checking if user already exists")
    }
  
    try {
        const user = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            studyNumber: req.body.studyNumber,
            school: req.body.school,
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