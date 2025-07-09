const { Router } = require('express');
const { adminModel, courseModel } = require("../db");
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { z } = require('zod');
const jwt = require('jsonwebtoken');
const { jwt_admin_secret } = require("../config");
const { adminAuthMiddleware } = require("../middlewares/admin");

const adminRouter = Router();


adminRouter.post("/signup", async function(req, res) {

    const reqBody = z.object({
        email : z.string().min(6).email(),
        password : z.string().min(6),
        firstName : z.string().max(20),
        lastName : z.string().max(20),
    })

    const parsedData = reqBody.safeParse(req.body);

    if(!parsedData.success){
        res.json({
            msg : "Incorrect format",
            error : parsedData.error
        });
        return;
    }

    const email = req.body.email;
    const password = req.body.password;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;

    try{
        const hashedPass = await bcrypt.hash(password, 5);
        // console.log(hashedPass);

        await adminModel.create({
            email : email,
            password : hashedPass,
            firstName,
            lastName,
        })

        res.json({
            msg : "You are signed up"
        })
    }
    catch(e){
        console.log(e);
        res.json({
            msg : "SignUp failed"
        })
    }

})


adminRouter.post("/signin", async function(req, res) {
    const { email, password } = req.body;

    const response = await adminModel.findOne({
        email : email,
    })

    if(!response){
        res.status(403).json({
            msg : "User does not exist in our database"
        })
        return;
    }

    const match = bcrypt.compare(password, response.password);

    if(match){
        const token = jwt.sign({
            id : response._id
        }, jwt_admin_secret)

        res.json({
            token : token,
        });
    }

    else{
        res.status(403).json({
            msg : "Incorrect credentials"
        })
    }

})


adminRouter.post("/course", adminAuthMiddleware, async function(req, res) {
    const { title, description, price, imageUrl } = req.body;

    const course = await courseModel.create({
        title, description, price, imageUrl, creatorId : req.adminId
    })

    res.json({
        msg : "Course created successfully",
        courseId : course._id
    });
})


adminRouter.put("/course", adminAuthMiddleware, async function(req, res) {
    // Endpoint to change title, description, price, imageUrl if needed
    const { courseId, title, description, price, imageUrl } = req.body;

    const courseObjId = new mongoose.Types.ObjectId(courseId);

    const course = await courseModel.findOne({
        _id : courseObjId
    })

    if(!course){
        res.json({
            msg : "No such course exist in our database"
        })
    }

    try{
        const updatedCourse = {
                title : (typeof title === 'string' && title.trim().length > 0) ? title : course.title,
                description : (typeof description === 'string' && description.trim().length > 0) ? description : course.description,
                price : (typeof price === 'number' && price > 0) ? price : course.price,
                imageUrl : (typeof imageUrl === 'string' && imageUrl.trim().length > 0) ? imageUrl : course.imageUrl,
        };
    
        await courseModel.findOneAndUpdate(course, updatedCourse);

        res.json({
            msg : "Updated Successfully"
        })
    }
    
    catch(e){
        res.json({
            msg : "Updation problem"
        })
    }

})


adminRouter.get("/course/bulk", adminAuthMiddleware, async function(req, res) {
    const id = new mongoose.Types.ObjectId(req.adminId);

    try{
        const response = await courseModel.find({
            creatorId : id
        })

        res.json({
            response : response,
        })
    }
    catch(e){
        res.json({
            msg : "This admin has no courses."
        })
    }
})




module.exports = {
    adminRouter : adminRouter
}