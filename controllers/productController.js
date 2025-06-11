const Product = require("../models/productModel");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

exports.createProduct = async (req, res) => {
  try {
    const { title, description, price, category } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "Image file is required" });
    }

    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "products", // optional folder in cloudinary
    });

    // Remove uploaded file from local disk (optional cleanup)
    fs.unlinkSync(req.file.path);

    // Create and save product
    const product = new Product({
      title,
      description,
      price,
      category,
      image: result.secure_url,
    });

    await product.save();

    res.status(201).json({ message: "Product created successfully", product });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const allProducts = await Product.find();
    if (allProducts.length === 0) {
      return res.status(404).json({ message: "No products" });
    }
    res
      .status(200)
      .json({ message: "Products fetched successfully", allProducts });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching products", error: error.message });
  }
};

// get product by id
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "No product found" });
    }
    res.status(200).json({ message: "Product fetched successfully", product });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching products", error: error.message });
  }
};

// update product by id
exports.updateProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, price, category } = req.body;

    // Find the existing product
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

     // Prepare update data
    const updateData = { title, description, price, category };

    // Handle image replacement (optional)
    if (req.file) {
      // Upload new image to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'products',
      });

      // Clean up local file
      fs.unlinkSync(req.file.path);

      updateData.image = result.secure_url;
    }

    // Update product
    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ message: "Product updated", product: updatedProduct });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// delete product by id
exports.deleteProductById = async (req,res) => {
  try {
    const { id } = req.params;

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json({ message: "Product deleted successfully", product: deletedProduct });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}