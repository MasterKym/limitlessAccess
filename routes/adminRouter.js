const express = require('express');
const verifyLogin = require('./verifyLogin');
const bcrypt = require('bcrypt')
const jsonwebtoken = require('jsonwebtoken')

const adminRegisterValidationSchema = require('./validations/adminRegisterValidationSchema');

const adminLoginValidationSchema = require('./validations/adminLoginValidationSchema');
const Admin = require('../models/Admin')
const Student = require('../models/Student')



const adminRouter = express.Router();


adminRouter.get("/admin/students",verifyLogin,  async (req, res) => {
    try{
        const students = await Student.find()
                                .sort({_id:1})
                                // .skip(skip)
                                // .limit(limit)

        if(students){
            return res.status(200).json(students)
        }
    } catch(error) {
        console.log(error)
        res.status(500).send(error)
    }
})

adminRouter.post("/admin/register", async (req, res) => {
    try{
        const { error, value } = adminRegisterValidationSchema.validate({
            username: req.body.username,
            password: req.body.password,
            city: req.body.city
        });
        if(error){
            return res.status(400).json({
                message: error.details[0].message
            });
        }


    } catch(error){
        console.log("Validation Error")
        console.log(error)
    }

    try {
        const adminExists = await Admin.findOne({
            username: req.body.username
          });

        if(adminExists){
            return res.status(409).json({
                message:"The username you entered already exist"
            });
        }
    } catch(error){
            console.log("Error while checking if user already exists")
    }

    try {
        const salt = await bcrypt.genSalt(15)
        const hashedPassword = await bcrypt.hash(req.body.password, salt)
        const admin = new Admin({
            username: req.body.username,
            password: hashedPassword,
            city: req.body.city
        })
        console.log("reached admin creation in DB")
        const savedAdmin = await admin.save();

        return res.status(200).json({
            username: savedAdmin.username,
            city: savedAdmin.city
        })
    } catch(error){
        console.log(error)
        return res.status(500).send(error)
    }
})

adminRouter.post("/admin/login", async (req, res) => {
    try{
        const { error, value } = adminLoginValidationSchema.validate({
            username: req.body.username,
            password: req.body.password
        });
        if(error){
            return res.status(400).json({
                message: error.details[0].message
            });
        }

    } catch(error){
        console.log("Validation Error")
        console.log(error)
    }

    try {
        const attemptAdmin = await Admin.findOne({
            username: req.body.username
        })

        if(!attemptAdmin){
            return res.status(404).json({
                message: "Admin Not Found"
            })
        }
        // console.log(attemptAdmin)
        // console.log(req.body.password)
        // console.log(attemptAdmin.password)

        const validPass = await bcrypt.compare(
            req.body.password,
            attemptAdmin.password
        )

        if(!validPass){
            return res.status(401).json({
                message: "Wrong Password"
            })
        }

        const loginToken = jsonwebtoken.sign(
            {
                _id: attemptAdmin._id,
                username: attemptAdmin.username
            },
            process.env.SECRET_JWT_TOKEN
        )

        res.cookie("login-token", loginToken)

        return res.status(200).json({
            message: "Successful Login"
        })
    } catch(error) {
        console.log(error)
        console.log("Error while checking if Admin is registered")
    }

    // try {

    // } catch(error){
    //     console.log(error)
    // }
})

module.exports = adminRouter;