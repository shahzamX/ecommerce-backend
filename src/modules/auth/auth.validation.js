const {z }= require("zod");


const loginSchema = z.object({
          email : z.string().email(),
          password : z.string().min(4)


     });


const registerSchema  = z.object({
          email : z.string().email(),
          password : z.string().min(4),
          role:z.string()


     });



module.exports={loginSchema,registerSchema};