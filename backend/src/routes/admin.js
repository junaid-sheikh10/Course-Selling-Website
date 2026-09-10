const asyncHandler = require("../middleware/async-handler");
const {Router}=require("express");
const {adminMiddleware}=require("../middleware/admin")
const {admins, courses} =require("../repositories");
const jwt=require("jsonwebtoken")
const {JWT_ADMIN_PASSWORD}=require("../config")

const adminRouter=Router();


adminRouter.post("/signup",asyncHandler(async (req,res)=>{
   const {email,password,firstName,lastName}=req.body

     const admin=await admins.findByEmail(email)

    if(admin){
         res.json({msg:"Admin already exists"})
     }else{
         await admins.create({
             email,
             password,
             firstName,
             lastName
         })

         res.json({
             msg:`${firstName} is signed Up`
         })
     }

     //await admins.create({
     //    email,
     //    password,
     //    firstName,
     //    lastName
     //})

    res.json({
        msg:`${firstName} is signed up`
    })

}))


adminRouter.post("/login",asyncHandler(async (req,res)=>{
    const {name,email,password}=req.body;

    const admin=await admins.findByEmail(email)

     if(admin){
         const token=jwt.sign({id:admin._id.toString()},JWT_ADMIN_PASSWORD)

         token?res.json({token,msg:name+" is logged in as Admin"}) : res.json({msg:"token invalid"}) 

     }else{
         res.json({
             msg:"Incorrect email/password"
         })
     }

    // res.json({
    //     admin
    // })

}))



adminRouter.post("/course",adminMiddleware,asyncHandler(async (req,res)=>{
     const adminId=req.userId
     const {title,description,imageUrl,price,creatorName}=req.body;    
      const course=await courses.create({
          title,description,imageUrl,price,creatorId:adminId,creatorName
      })

     res.json({
         msg:"course created",
         courseId:course._id
        //adminId
     })
}))

adminRouter.put("/course",adminMiddleware,asyncHandler(async (req,res)=>{
         const adminId=req.userId;
         const {title,description,imageUrl,price,courseId}=req.body;
         const course=await courses.updateOwned(courseId, adminId, {title,description,imageUrl,price});
         if (!course) return res.status(404).json({msg:"Course not found"});
         res.json({msg:"course updated", courseId:course._id});
}))
    





 adminRouter.get("/course/bulk",adminMiddleware,asyncHandler(async (req,res)=>{
     const adminId=req.userId
     const courseList=await courses.listByCreator(adminId)
    res.json({
         courses: courseList
    })
 }))

module.exports={
    adminRouter:adminRouter
}