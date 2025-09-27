// backend/seed.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/productModel.js";
import products from "./data/products.js";

dotenv.config();

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Product.deleteMany(); // clear existing products
    await Product.insertMany(products); // insert sample products
    console.log("Database seeded!");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedDB();
