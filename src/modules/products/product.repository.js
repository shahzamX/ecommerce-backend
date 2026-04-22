const pool = require("../../config/db.js");
const createProduct=async(product)=>{
    let result = await pool.query(
        "INSERT INTO products(name,description,price,stock) VALUES($1,$2,$3,$4) RETURNING id,name, description, price, stock, created_at ",
        [product.name,product.description,product.price,product.stock]
    );

    return result.rows[0];
}

const getProducts = async (limit, offset)=>{
    let result = await pool.query(
        "SELECT id, name, description, price, stock, created_at FROM products WHERE is_active = true ORDER BY created_at DESC LIMIT $1 OFFSET $2",
        [limit,offset]
    )
    return result.rows;
}

const getProductById =async (id)=>{
    let result = await pool.query(
        "SELECT * FROM products WHERE id =$1 AND is_active = true",
        [id]
    )

    return result.rows[0] || null;
}

const countProducts = async()=>{

    let count = await pool.query('SELECT COUNT(*) FROM products WHERE is_active = true'); 
    return parseInt(count.rows[0].count);

}

const updateProduct = async (id, fields) => {
    let keys = Object.keys(fields);
    let allowedFields = ["name", "description", "price", "stock"];
    keys = keys.filter(key => allowedFields.includes(key));
    
    let setClause = keys
        .map((key, index) => 
             `${key} = $${index+1}` ).join(", ");
            
                          
        
    let values = keys.map(key=> fields[key]);

    if(keys.length ===0) return null;


    const query = `
        UPDATE products
        SET ${setClause}, updated_at = NOW()
        WHERE id = $${keys.length + 1}  AND is_active = true
        RETURNING id, name, price, stock
    `;

    const result = await pool.query(query,[...values, id]);

    return result.rows[0] || null;
}


const softDeleteProduct =  async(id)=>{
    let result = await pool.query(
        "UPDATE products SET is_active= FALSE ,updated_at = NOW() WHERE id=$1 AND is_active=TRUE RETURNING id,name,is_active ",
        [id]
    )
    return result.rows[0] || null;
}

module.exports={getProducts,
getProductById,
updateProduct,
softDeleteProduct,
createProduct,
countProducts}

