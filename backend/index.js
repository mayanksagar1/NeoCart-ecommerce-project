// packages
import express from "express";
import dotenv from "dotenv";
import path from "path";
import cookieParser from "cookie-parser";

// utilities
import connectDB from "./config/db.js";
import { connectCloudinary } from "./config/cloudinary.js";
import userRoutes from "./routes/userRoutes.js";
import categoryRouter from "./routes/categoryRoutes.js";
import productRouter from "./routes/productRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import addressRoutes from "./routes/addressRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";

dotenv.config();

connectCloudinary();

connectDB();

const port = process.env.PORT || 5000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRouter);
app.use("/api/products", productRouter);
app.use("/api/uploads", uploadRoutes);
app.use("/api/user/address", addressRoutes);
app.use("/api/cart", cartRoutes);

app.listen(port, () => console.log("Server running on the Port : " + port));
