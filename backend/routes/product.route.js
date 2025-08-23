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

router.get("/", (req, res, next) => {
  if (req.query.username) {
    return next();
  }
  protect(req, res, next);
}, getProducts);

router.post("/", protect, createProduct);
router.put("/:id", protect, updateProduct);
router.delete("/:id", protect, deleteProduct);

export default router;