import Product from "../models/product.js";
import mongoose, { get } from 'mongoose';

export const getProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products', error: error.message });
    }
}

export const createProduct = async (req, res) => {
    const product = req.body;
    console.log("📥 Incoming body:", req.body);


    if(!product.name || !product.price || !product.image)  {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const newProduct = new Product(product);
    try {
        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ message: 'Error saving product', error: error.message });
    }
}

export const updateProduct = async (req, res) => {
    const { id } = req.params;
    const productUpdates = req.body;

    if(mongoose.Types.ObjectId.isValid(id) === false) {
        return res.status(400).json({ message: 'Invalid product ID' });
    }
    
    try {
        const updatedProducts = await Product.findByIdAndUpdate(id, productUpdates, { new: true });
        res.status(200).json({ success: "true", message: 'Product updated successfully', data: updatedProducts });
    } catch (error) {
        res.status(500).json({ message: 'Error updating product', error: error.message });
    }
}

export const deleteProduct =  async (req, res) => {
    const { id } = req.params;

    if(mongoose.Types.ObjectId.isValid(id) === false) {
        return res.status(400).json({ message: 'Invalid product ID' });
    }

    try {
        await Product.findByIdAndDelete(id);
        res.status(200).json({ success: "true", message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting product', error: error.message });
    }
}

