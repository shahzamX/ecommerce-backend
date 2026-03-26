const { ZodError } = require("zod");


const errorMiddlwaware = (err,req,res,next)=>{

    console.log(err.stack);


    if(err instanceof ZodError){
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: err.errors
        });
    }
    let statusCode =  err.status || 500;

    return res.status(statusCode).json({
        success:false,
        message:err.message||"Internal Server Error"});
    

}

module.exports = errorMiddlwaware;