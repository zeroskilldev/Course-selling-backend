const { Router } = require('express');
const { z } = require('zod');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { userModel } = require('../db');
const userRouter = Router();
const { jwt_user_secret } = require("../config");
const { userAuthMiddleware } = require("../middlewares/user");



userRouter.post("/signup", async function(req, res) {
    const { email, password, firstName, lastName } = req.body;

    // Schema for expected body
    const requiredBody = z.object({
        email : z.string().email().min(6),
        password : z.string().min(6),
        firstName : z.string().max(20),
        lastName : z.string().max(20),
    })

    const parsedData = requiredBody.safeParse(req.body);

    if(!parsedData.success){
        res.status(403).json({
            msg : "Incorrect Format",
            error : parsedData.error,
        });
        return;
    }

    try{
        const hashedPass = await bcrypt.hash(password, 5);
        await userModel.create({
            email,
            password : hashedPass,
            firstName,
            lastName
        });

        res.json({
            msg : "You are signed up successfully."
        })
    }
    catch(e){
        res.json({
            msg : "Error signing up."
        })
    }
})


userRouter.post("/signin", async function(req, res) {
    const { email, password } = req.body;

    const response = await userModel.findOne({
        email
    });

    if(!response){
        res.status(403).json({
            msg : "User does not exist in our database"
        })
        return;
    }


    const matched = bcrypt.compare(password, response.password);

    if(matched){
        const token = jwt.sign({
            id : response._id
        }, jwt_user_secret);
        res.json({
            token : token
        })
    }
    else{
        res.status(403).json({
            msg : "You're not signed up."
        })
    }
})


userRouter.get("/purchases", userAuthMiddleware, async function(req, res) {
    
})


module.exports = ({
    userRouter : userRouter
})