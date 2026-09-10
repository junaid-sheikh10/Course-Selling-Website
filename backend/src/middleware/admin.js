const jwt=require("jsonwebtoken");
const {JWT_ADMIN_PASSWORD}=require("../config")


function adminMiddleware(req,res,next){
    const token=req.headers.token;
    decodedData=jwt.verify(token,JWT_ADMIN_PASSWORD);

    if(decodedData){
        req.userId=decodedData.id
        console.log("decoded id="+decodedData.id);
        
        next()
    }else{
        res.status(403).json({
            msg:"Admin Token Invalid"
        })
    }

}

module.exports={
    adminMiddleware
}