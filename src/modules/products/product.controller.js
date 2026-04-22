const {createProductSchema} = require("./product.validation");
    
const service = require("./product.service.js");

const createProduct = async (req, res, next) => {

    try {

        let  data = createProductSchema.parse(req.body);
        let product = await service.createProduct(data);
        return res.status(201).json(
            {
                success: true,
                data: product
            }
        )
    } catch (err) {
        next(err);

    }
}

const getProducts = async (req, res, next) => {
    try {
        let { limit, offset } = req.query;
        let result = await service.getProducts(Number(limit), Number(offset));
        res.status(200).json({
            success: true,
            ...result
        })



    } catch (err) {
        next(err);
    }

}

const getProductById = async (req, res, next)=>{
    try {
        let {id} = req.params;
        let product = await service.getProductById(id);
        res.status(200).json({
            success: true,
            data:product
        })
    } catch (error) {
        next(error)

    }
}

const updateProduct = async (req, res, next) => {
    try {
        let{ id} = req.params;
        let result = await service.updateProduct(id,req.body);
            res.status(200).json({
                success:true,
                data:result
            })
    } catch (error) {
        next(error);
    }
}

const deleteProduct = async (req,res,next)=>{
    try {
    let {id }= req.params;        
    let result = await service.deleteProduct(id);
        res.status(200).json({
            success:true,
            data:result
        })
    } catch (error){
        next(error);
        
    }
}

module.exports={getProducts,
getProductById,
updateProduct,
deleteProduct,
createProduct}


