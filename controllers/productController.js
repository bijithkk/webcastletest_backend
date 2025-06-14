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

    res.status(201).json({ message: "Product created successfully", success: true, product });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 8;
    const skip = (page - 1) * limit;
    const search = req.query.search || "";
    const category = req.query.category || "";

    // Build the base query with category filter
    const baseQuery = {};
    
    if (category) {
      const categoryArray = category.split(",").map((cat) => cat.trim());
      baseQuery.category = { $in: categoryArray };
    }

    // If search is provided, add it to the existing filter
    const finalQuery = { ...baseQuery };
    if (search) {
      finalQuery.title = { $regex: search, $options: "i" };
    }

    const [products, total] = await Promise.all([
      Product.find(finalQuery).skip(skip).limit(limit),
      Product.countDocuments(finalQuery),
    ]);

    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No products found matching your criteria",
      });
    }

    res.status(200).json({
      success: true,
      data: products,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching products",
      error: error.message,
    });
  }
};

// get product by id
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
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
        folder: "products",
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

    res
      .status(200)
      .json({ message: "Product updated", product: updatedProduct });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// delete product by id
exports.deleteProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    res
      .status(200)
      .json({
        message: "Product deleted successfully",
        product: deletedProduct,
      });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

//search and filter
exports.searchAndFilterProducts = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ error: "Search query is required" });
    }

    // Handle multiple comma-separated search terms
    const terms = query.split(",").map((term) => term.trim());

    const orConditions = [];

    terms.forEach((term) => {
      orConditions.push({ title: { $regex: term, $options: "i" } });
      orConditions.push({ category: { $regex: term, $options: "i" } });
    });

    const products = await Product.find({ $or: orConditions });

    res.status(200).json({ products });
  } catch (error) {
    console.error("Error searching products:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getAllCategoriesName = async (req, res) => {
  try {
    const categories = await Product.distinct("category");
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch categories" });
  }
};

// // search by product category
// exports.search = async (req,res) => {
//   try {
//     const { query } = req.query;

//     if (!query) {
//       return res.status(400).json({ error: "Search query is required" });
//     }

//     const results = await Product.find({
//       category: { $regex: query, $options: "i" }
//     });

//     res.status(200).json({ results });
//   } catch (error) {
//     console.error("Error searching products:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// }

// //filter by product category
// exports.filterByCategory = async (req, res) => {
//   try {
//     const { category } = req.query; // expects /filter?category=electronics
//     console.log('category :- ',category);

//     if (!category) {
//       return res.status(400).json({ error: "Category is required" });
//     }

//     // Support both single string and comma-separated list
//     const categories = Array.isArray(category)
//       ? category
//       : category.split(',').map(cat => cat.trim());

//     const products = await Product.find({
//       category: { $in: categories }
//     });

//     res.status(200).json({ products });
//   } catch (error) {
//     console.error("Error filtering products by category:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };
