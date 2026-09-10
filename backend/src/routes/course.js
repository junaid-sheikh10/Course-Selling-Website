const asyncHandler = require("../middleware/async-handler");
const {Router}=require("express");
const courseRouter=Router();
const jwt=require("jsonwebtoken");
const {userMiddleware} =require("../middleware/user")
const {purchases,courses}=require("../repositories")

 courseRouter.post("/purchase",userMiddleware,asyncHandler(async (req,res)=>{
     const userId=req.userId;
     const courseId=req.body.courseId;

    await purchases.create({
          userId,
          courseId
    })

     res.json({
         msg:"course has been purchased",
        userId 
     })

 }))

courseRouter.get("/preview",asyncHandler(async (req,res)=>{
    const courseList=await courses.list()

    res.json({
        msg:"these are all the courses",
        courses: courseList

    });
}))

module.exports={
    courseRouter
}
