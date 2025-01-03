import express from "express";
import { authenticate, authorizeAdmin } from "../middleware/authHandler.js";
import {
  createProduct,
  updateProductById,
  deleteProductById,
  fetchProducts,
  fetchProductById,
  fetchAllProducts,
  addProductReview,
  updateProductReview,
  fetchTopProducts,
  fetchNewProducts,
} from "../controllers/productController.js";

const router = express.Router();

router.route("/")
  .get(fetchProducts)
  .post(authenticate, authorizeAdmin, createProduct);

router.route("/all").get(fetchAllProducts);

router.route("/top").get(fetchTopProducts);
router.route("/new").get(fetchNewProducts);

router.route("/:id")
  .get(fetchProductById)
  .put(authenticate, authorizeAdmin, updateProductById)
  .delete(authenticate, authorizeAdmin, deleteProductById);


router.route("/:id/reviews")
  .post(authenticate, addProductReview)
  .put(authenticate, updateProductReview);

export default router;