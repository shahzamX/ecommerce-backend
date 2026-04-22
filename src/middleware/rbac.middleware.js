const createError = require("../errors/createError")

const isAdmin = (req,res,next)=>{
    if(req.user.role!=="ADMIN"){
        return next(createError(403,"forbidden"));
    }
    next();
}

module.exports={isAdmin};