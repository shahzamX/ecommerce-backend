
const {z} = require("zod");

const createProductSchema = z.object({
    name:z.string(),
    description:z.string(),
    price:z.number(),
    stock:z.number()

})

module.exports ={createProductSchema};