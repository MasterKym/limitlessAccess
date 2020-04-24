const express = require('express');
const mongoose = require('mongoose');
const Joi = require("@hapi/joi");

const User = require('./models/User')

const connectToDb = () => {
    const dbURL = process.env.NODE_ENV === 'dev' ?
                        process.env.localDB :
                        process.env.remoteDB
    console.log("Db URL:", dbURL)

    mongoose.connect(
        dbURL,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true
        },
        (err) => {
            if(err) {
                console.log(err)
                throw err
            }
        }
    )
    .then(() => {console.log("Connection Established")})
    .catch(() => {
        console.log("Error while connecting to DB")
        // console.log(`Waiting ${isDev ? 2 : 15} seconds before re attempting..`)
        // const timer = setTimeout(connectToDb, isDev ? 1000 : 15000)
    });
}
// Connect to Database
connectToDb()

const app = express();
app.use(express.json())

// Set Up CORS SETTINGs
app.use("", (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Headers", "*");

    next();
  });




const userRouter = require('./routes/userRouter')
app.use("", userRouter)
const adminRouter = require('./routes/adminRouter')
app.use("", adminRouter)
const PORT = process.env.PORT || 5000
app.listen(
    PORT,
    () => {
        console.log("App listening..")
    }
)