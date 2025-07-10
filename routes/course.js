const { Router } = require('express');
const { courseModel, purchaseModel } = require('../db');
const { userAuthMiddleware } = require('../middlewares/user');

const courseRouter = Router();


courseRouter.get("/preview", async function(req, res) {
    const courses = await courseModel.find({});

    res.json({
        courses
    })
})


courseRouter.post("/purchase", userAuthMiddleware, async function(req, res) {
    const userId = req.userId;
    const courseId = req.body.courseId;

    await purchaseModel.create({
        userId,
        courseId
    })

    res.json({
        msg : "You have succesfully bought a course"
    });
})


module.exports = ({
    courseRouter : courseRouter
})