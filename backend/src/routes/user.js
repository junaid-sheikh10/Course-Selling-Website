const asyncHandler = require("../middleware/async-handler");
const {Router} =require("express");
const {userMiddleware}=require("../middleware/user")
const {users, purchases, courses}=require("../repositories")
const jwt=require("jsonwebtoken");
const {JWT_USER_PASSWORD}=require("../config")

const userRouter = Router();

userRouter.post("/",(req,res)=>{
    const email=req.body.email;
    const password=req.body.password;
    const firstName=req.body.firstName;
    const lastName=req.body.lastName

    res.json({
        msg:"post endpoint works",
        email,
        firstName,lastName,
        password
    })
})


userRouter.post("/signup",asyncHandler(async (req,res)=>{
    const {email,password,firstName,lastName}=req.body;

     await users.create({
          email,
          password,
          firstName,
          lastName
      })

    res.json({
        msg:`${firstName} is signed Up`,
        email,
        password,
    })
}))

userRouter.post("/login",asyncHandler(async (req,res)=>{
    const email=req.body.email
    const password=req.body.password
    const firstName=req.body.name

    const foundUser=await users.findByEmail(email)

    console.log("found user= "+foundUser);

    if(foundUser && foundUser.password === password){
        const token=jwt.sign({
            id:foundUser._id.toString()
        },JWT_USER_PASSWORD);

        res.json({
            msg:`${firstName} is logged In`,
            token
        })
    }else{
        res.json({
            msg:"User not available"
        })
    }
}))




//user can see all courses-preview endpoint in course.js


//user can see their courses
 userRouter.get("/purchased",userMiddleware,asyncHandler(async (req,res)=>{
     const userId=req.userId;

      const purchased = await purchases.listByUser(userId);
      const courseData = await courses.listByIds(purchased.map(item => item.courseId));

     res.json({
         msg:"see purchased courses",
         userId,
         purchased,
         courseData
     })
 }))


module.exports={
    userRouter
}