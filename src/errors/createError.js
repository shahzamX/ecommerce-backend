const createError=(statusCode,message)=>{
    let err = new Error(message);
    err.status = statusCode;
    return err;
}

module.exports= createError;