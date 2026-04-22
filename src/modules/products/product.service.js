const createError = require("../../errors/createError");
const repo = require("./product.repository");

const createProduct = async (fields) => {

    
    let product = await repo.createProduct(fields);
    
    return product;



}

const getProducts = async(limit,offset)=>{
    let safeLimit = Math.min(limit || 10,50);
    let  safeOffset = Math.max(offset||0,0);
    let result = await repo.getProducts(safeLimit, safeOffset);
    let total = await repo.countProducts();
    return {
        data:result,
        pagination:{
            total,
            limit:safeLimit,
            offset:safeOffset
        }
    };

}

const getProductById = async(id)=>{
    let result = await repo.getProductById(id);
    if(result=== null){
        throw createError(404,"product not found");

    }
    return result;
}

const updateProduct = async (id,fields)=>{
    let result = await repo.updateProduct(id,fields);
    if(result ===null){
        throw createError(404,"Product not found or no valid fields");

    }
    return result;
}

const deleteProduct = async (id)=>{
    let result = await repo.softDeleteProduct(id);
    if (!result){
        throw createError(404,"product not found");
    }
    return result; 
}


module.exports={getProducts,
getProductById,
updateProduct,
deleteProduct,
createProduct}