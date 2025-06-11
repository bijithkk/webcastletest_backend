const express = require('express');
const router = express.Router();
const upload = require("../middleware/multer");
const productController = require('../controllers/productController');

//create new product
router.post("/add", upload.single("image"), productController.createProduct);

// get all products
router.get("/get",productController.getAllProducts);

// get product by id
router.get("/get/:id",productController.getProductById);

// update product by id
router.patch("/update/:id",upload.single("image"),productController.updateProductById);

// delete product by id
router.delete("/delete/:id", productController.deleteProductById);

// search by product category
router.get("/search", productController.searchAndFilterProducts);

module.exports = router;