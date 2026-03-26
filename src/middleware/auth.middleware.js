const createError = require("../errors/createError.js");
const jwt = require('jsonwebtoken');
const {ACCESS_TOKEN_SECRET} =require("../config/env.js");

const authCheck = (req, res, next) => {
    let tokenPres = req.get("Authorization");
    if (!tokenPres) {
        return next(createError(401, "Authorization header not present"));
    }
    let t = tokenPres.split(" ");
    if (t.length !== 2) {

        return next(createError(401, "Invalid token"));
    }
    else {
        if (t[0] === "Bearer") {
            let token = t[1];
            if (!token) {

                return next(createError(401, "auth tokkne not present"));

            }

            try {
                let decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
                req.user = {
                    id: decoded.sub,
                    role: decoded.role,
                };
                return next();

            } catch (error) {
                if(error.name==="TokenExpiredError"){
                    return next(createError(401,error.name));
                }

                return next(createError(401, error.message));

            }


        }
        else {

            return next(createError(401, "bearer type token not present"));
        }

    }
}

module.exports = { authCheck };