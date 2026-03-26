const pool = require('../../config/db.js')

const createUser = async(email,hashedPassword,role)=>{
    
        const result = await pool.query(
        "INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3) RETURNING  id,email,role",
        [email, hashedPassword, role]
        );
        // console.log(result);
        return result;
}

const findUserByEmail = async (email)=>{
    let result = await pool.query(
        "SELECT * FROM users WHERE email = $1",
        [email]
    );
    // console.log(result);
    return result;
}

const addRefreshToken= async (userId,refreshToke,userAgent,expiresAt) =>{
    let result  = await pool.query(
        "INSERT INTO   sessions (user_id,refresh_token_hash,user_agent,expires_at) VALUES ($1, $2, $3,$4) RETURNING id"
        ,[userId,refreshToke,userAgent,expiresAt]);
    return result;
}
const getRefreshTokenId = async(refreshTokenHash)=>{
    try {
    const result = await pool.query(
        "SELECT id, user_id, revoked_at FROM sessions WHERE refresh_token_hash = $1",
        [refreshTokenHash]
    );
    return result;
} catch (err) {
    console.error("Error fetching refresh token:", err);
    throw err;
}
}

const revokRefreshToken= async(id)=>{
     const result = await pool.query(
        `UPDATE sessions 
         SET revoked_at = NOW() 
         WHERE id = $1 
         RETURNING id, user_id, revoked_at`,
        [id]
    );

    return result.rows[0];
}
module.exports = {revokRefreshToken,createUser,findUserByEmail ,addRefreshToken,getRefreshTokenId}