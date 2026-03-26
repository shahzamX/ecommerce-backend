const express = require("express");
const createError = require("../../errors/createError");
const router = express.Router();
const {login,refresh,register,logout} = require("./auth.controller");



router.post("/register",register)
router.post("/login",login);
router.post("/refresh",refresh);
router.post("/logout",logout);
 
module.exports= router;


