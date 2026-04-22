const express = require('express');
const app = express();
app.use(express.json());
const errorMiddleware = require("./middleware/error.middleware.js");
const createError = require('./errors/createError');
const  authRoutes = require("./modules/auth/auth.routes.js");
const { authCheck } = require('./middleware/auth.middleware.js');

const productRoutes = require("./modules/products/product.routes.js");

app.get("/health",(req,res)=>{
    
    res.status(200).json({
        status:"ok",
        message:"server running",
    })
})

app.get("/me", authCheck, (req, res) => {
    res.json({
        success: true,
        user: req.user
    });
});

const handler404 = (req,res,next)=>{
    
    next(createError(404,"ROute not found "));
    return;
}

// example use fo error middleware
// app.get("/user",(req,res,next)=>{
//     let usr = getuser(usr[3]);
//     if(usr){
//         res.status(200);
//         res.send({message:usr});
//     }
//     else {
//         let err = new Error("user not found");
//         err.status = 404;
//         return next(err);
        
//         // or call hadle404();
//     }
    
// })

app.use("/api/products", productRoutes);
app.use("/api/auth",authRoutes);

app.use(handler404);
app.use(errorMiddleware);

module.exports = {app};
