const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;


// Schema definition

const UserSchema = new Schema({
    email : {type : String, unique : true},
    password : String,
    firstName : String,
    lastName : String
})


const AdminSchema = new Schema({
    email : {type : String, unique : true},
    password : String,
    firstName : String,
    lastName : String
})


const CourseSchema = new Schema({
    title : String,
    description : String,
    price : Number,
    imageUrl : String,
    creatorId : ObjectId
})


const PurchaseSchema = new Schema({
    userId : ObjectId,
    courseId : ObjectId,
})


const userModel = mongoose.model("user", UserSchema);
const adminModel = mongoose.model("admin", AdminSchema);
const courseModel = mongoose.model("course", CourseSchema);
const purchaseModel = mongoose.model("purchase", PurchaseSchema);


module.exports = ({
    userModel,
    adminModel,
    courseModel,
    purchaseModel
})