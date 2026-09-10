const jwt=require("jsonwebtoken");
const {JWT_USER_PASSWORD}=require("../config")


function userMiddleware(req,res,next){
    token =req.headers.token

    decodededData=jwt.verify(token,JWT_USER_PASSWORD);

    if(decodededData){
        req.userId=decodededData.id
        console.log("decoded Id "+decodededData.id)
        next()
    }else{
        res.status(403).json({
            msg:"Invalid Token"
        })
    }

}

module.exports={userMiddleware}