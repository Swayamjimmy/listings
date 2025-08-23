// routes/product.route.js
import express from "express";
import {
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct,
} from "../controllers/product.controller.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Public route for viewing products by username (query param)
// Private route for getting authenticated user's products
router.get("/", (req, res, next) => {
  // If username query param exists, allow public access
  if (req.query.username) {
    return next();
  }
  // Otherwise, require authentication
  protect(req, res, next);
}, getProducts);

// All other routes require authentication
router.post("/", protect, createProduct);
router.put("/:id", protect, updateProduct);
router.delete("/:id", protect, deleteProduct);

export default router;