const createError = require("../../errors/createError");
const jwt = require('jsonwebtoken');
const { createUser ,findUserByEmail ,addRefreshToken,getRefreshTokenId} = require('./auth.utility.js');
const pool = require('../../config/db.js')

const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = require("../../config/env.js")
const bcrypt = require('bcrypt');



const crypto = require("crypto");


const loginUser = async (email, password,userAgent) => {
    // const dummyUser = {
    //     id: 201601,
    //     email: "admin@test.com",
    //     password: "1234",
    //     role: "user",
    // };


     const result = await findUserByEmail(email);
    let user1 = result.rows[0];
    if (result.rowCount === 0) {
        throw createError(404, "user not found");

    }
    console.log(user1)
    const isMatch = await bcrypt.compare(password, user1.password_hash);
    if (!isMatch) {
        throw createError(401, "Invalid credentials");
    }


    let accessPayload = {
        sub: user1.id,
        role: user1.role,
        tokenType: "access",

    }
    let refreshPayload = {
        sub: user1.id,
        role: user1.role,
        tokenType: "refresh",

    }


    const accessToken = jwt.sign(accessPayload, ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign(refreshPayload, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
    // we will sore this refresh token to db
    const expires_at = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    let hashedRefreshToken =crypto
        .createHash("sha256")
        .update(refreshToken)
        .digest("hex");
    
    let sessionId  = await  addRefreshToken(user1.id,hashedRefreshToken,userAgent,expires_at);

    return {
        user1,
        accessToken,
        refreshToken
    };


}

const verifyRefresh = (token) => {
    try {
        let decoded =  jwt.verify(token, REFRESH_TOKEN_SECRET);
        return decoded;

    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return { error: TokenExpiredError }
        }
        return (createError(401, error.name));
    }

}

const findRefreshToken = async(refreshToken)=>{
    let refreshTokenHash=crypto
        .createHash("sha256")
        .update(refreshToken)
        .digest("hex");
        console.log("findref top")
     let result = await getRefreshTokenId(refreshTokenHash);
             console.log("findref bottom");

     return result;
    }

const newToken =async (id) => {

    let accessPayload = {
        sub: id,
        role: "user",
        tokenType: "access",

    }
    const accessToken = jwt.sign(accessPayload, ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
    return accessToken;
}




const registerUser = async (email, password, role) => {

    const result = await findUserByEmail (email);
    
    if(result.rowCount !==0){
        throw createError(409,"email is already registered")
    }


    const saltRounds = 10;
    let  hashedPassword = await bcrypt.hash(password, saltRounds);

    let user = await createUser(email, hashedPassword, role);
    return user.rows[0];

}


module.exports = { loginUser, verifyRefresh, registerUser,findRefreshToken,newToken };