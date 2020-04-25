const express = require('express');
const User = require('../models/Student')
const multer = require('multer')
const fs = require('fs');

const userValidationSchema = require('./validations/studentValidationSchema')

const userRouter = express.Router();

// Setup multer to receive images in userRouter.post
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        
        cb(null, './uploads')
    },

    filename: (req, file, cb) => {
        // console.log("From multer")
        // console.log(file)

        cb(null,
            req.body.firstName + req.body.lastName + new Date().toISOString() + '.' + file.mimetype.split('/')[1])
    }
})

const upload = multer({
    storage: storage
})


userRouter.post("/addstudent",

    // First Callback: Multer Middleware
    upload.array('studentCardPhotos', 2),
    // Second Callback: Express middleware
    async (req, res) => {
        
        // console.log(req.body)

        // Student Card Images Handler
        const cardPhotos = []
        for (photo of req.files){

            const data = fs.readFileSync(path= photo.path)
            const mimeType = photo.mimetype

            cardPhotos.push({
                data,
                mimeType
            })
        }
        console.log(cardPhotos)

        try{
            const { error, value } = userValidationSchema.validate({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                studyNumber: req.body.studyNumber,
                school: req.body.school,
                phone: req.body.phone,
                city: req.body.city,

                cardPhotos: cardPhotos

            });
            if(error){
                return res.status(400).json({
                    message: error.details[0].message});
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
            return res.status(409).json({
                message: "The information you entered already exists"
            });
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
                city: req.body.city,

                cardPhotos: cardPhotos
            })

            // TODO: delete file from uploads folder.
            console.log("Reached account creation in DB")
            const savedUser = await user.save()

            return res.status(200).json(savedUser)
        } catch(error){
            console.log(error)
            return res.status(500).send(error)
        }
});


module.exports = userRouter;