require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const { userRouter } = require("./routes/user");
const { adminRouter } = require("./routes/admin");
const { courseRouter } = require("./routes/course");

app.use(express.json());

app.use("/user", userRouter);
app.use("/admin", adminRouter);
app.use("/course", courseRouter);

async function main(){
    await mongoose.connect(process.env.MONGO_URL); //use dotenv to store connection string
    console.log("Listening on port 3000");
    app.listen(3000);
}


main();
