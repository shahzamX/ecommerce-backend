
const createError = require("../../errors/createError");
const { loginUser, verifyRefresh, newToken, registerUser, findRefreshToken } = require("./auth.service");
const { createUser, revokRefreshToken } = require("./auth.utility");

const { loginSchema, registerSchema } = require("./auth.validation")


const login = async (req, res, next) => {


     try {

          let { email, password } = loginSchema.parse(req.body);
          let userAgent = req.headers["user-agent"];

          let user = await loginUser(email, password, userAgent);

          res.status(200).json({
               success: true,
               message: "Login successful",
               data: user.email,
               accessToken: user.accessToken,
               refreshToken: user.refreshToken,
          });

          //else we will generate jwt token and send it


     } catch (error) {
          next(error);
     }

}

const register = async (req, res, next) => {
     try {
          let { email, password, role } = registerSchema.parse(req.body);
          let user = await registerUser(email, password, role);
          return res.status(200).json({
               "success": true,
               "data": {
                    "user": user
               }
          });
     } catch (error) {
          next(error)
     }
}

const refresh = async(req, res, next) => {
     let refreshToken = req.body.refreshToken;
     let result = verifyRefresh(refreshToken);
     if (result.error) {

          return next(createError(401, "Unauthorized"));
     }
     else {

          console.log("refres1");

          let tokenId = (await findRefreshToken(refreshToken));
          console.log(tokenId);
          if (!tokenId) {
               return next(createError(401, "Unauthorized"));
          }
          if(tokenId.rows[0].revoked_at !== null){
               return next(createError(401, "Unauthorized"));
          }
          if (new Date(tokenId.rows[0].expires_at) < new Date()) {
               return next(createError(401, "Token expired"));
}
          let newTok = await  newToken(result.sub);
          return res.status(200).json({
               "success": true,
               "data": {
                    "accessToken": newTok
               }
          });
     }


}


const logout = async (req, res, next) => {
     let refreshToken = req.body.refreshToken;

     let tokenResult = await findRefreshToken(refreshToken);
     console.log(tokenResult);
     if ( tokenResult.rowCount!==1) {
          
          return next(createError(401, "Unauthorized"));
     }
     console.log("logout top")
     let resutl =await revokRefreshToken(tokenResult.rows[0].id);
          console.log(resutl);


     return res.status(200).json({
               "success": true,
               "data": {
                    "message": "user loggedout"
               }
          });



}

module.exports = { login, refresh, register,logout }
