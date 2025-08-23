// controllers/product.controller.js
import mongoose from "mongoose";
import Product from "../models/Product.model.js";

export const getProducts = async (req, res) => {
  try {
    let products;
    
    // If username is provided in query, get that user's products (public view)
    if (req.query.username) {
      // First find the user by username to get their ID
      const User = (await import('../models/User.model.js')).default;
      const user = await User.findOne({ username: req.query.username });
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }
      
      products = await Product.find({ owner: user._id }).populate('owner', 'username storeName');
    } else if (req.user) {
      // If authenticated user, get their products
      products = await Product.find({ owner: req.user._id }).populate('owner', 'username storeName');
    } else {
      return res.status(401).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.status(200).json({
      success: true,
      data: products
    });
  } catch (error) {
    console.log("Error in fetching products:", error.message);
    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};

export const createProduct = async (req, res) => {
  const { name, price, image, description } = req.body;

  if (!name || !price || !image) {
    return res.status(400).json({
      success: false,
      message: "Please provide all required fields (name, price, image)"
    });
  }

  try {
    const newProduct = new Product({
      name,
      price,
      image,
      description: description || '',
      owner: req.user._id
    });

    await newProduct.save();

    // Populate owner info before sending response
    await newProduct.populate('owner', 'username storeName');

    res.status(201).json({
      success: true,
      data: newProduct,
      message: "Product created successfully"
    });
  } catch (error) {
    console.error("Error in Create product:", error.message);
    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};

export const updateProduct = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({
      success: false,
      message: "Invalid Product Id"
    });
  }

  try {
    // First check if product exists and belongs to the user
    const product = await Product.findById(id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    if (product.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this product"
      });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    ).populate('owner', 'username storeName');

    res.status(200).json({
      success: true,
      data: updatedProduct,
      message: "Product updated successfully"
    });
  } catch (error) {
    console.log("Error in updating product:", error.message);
    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({
      success: false,
      message: "Invalid Product Id"
    });
  }

  try {
    // First check if product exists and belongs to the user
    const product = await Product.findById(id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    if (product.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this product"
      });
    }

    await Product.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Product deleted successfully"
    });
  } catch (error) {
    console.log("Error in deleting product:", error.message);
    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};