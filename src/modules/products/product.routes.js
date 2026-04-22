const express = require("express");
const router = express.Router();

const {isAdmin} = require("../../middleware/rbac.middleware.js");
const {authCheck}= require("../../middleware/auth.middleware.js");

const contr = require("./product.controller.js");

router.get("/",contr.getProducts);
router.get("/:id",contr.getProductById);

router.post("/",authCheck,isAdmin,contr.createProduct);
router.delete("/:id",authCheck,isAdmin,contr.deleteProduct);
router.patch("/:id",authCheck,isAdmin,contr.updateProduct);

module.exports = router;