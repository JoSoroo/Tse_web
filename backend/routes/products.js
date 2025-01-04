import express from "express";
import Product from"../models/Product.js";

const router = express.Router();
// Бүтээгдэхүүн авах API
/**
 * @swagger
 * /products:
 *   get:
 *     summary: Бүтээгдэхүүн авах
 *     description: Өгөгдлийн сан дахь бүх бүтээгдэхүүний мэдээллийг авах.
 *     responses:
 *       200:
 *         description: Бүтээгдэхүүний мэдээлэл амжилттай авлаа.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: number
 *                   name:
 *                     type: string
 *                   price:
 *                     type: number
 *                   menuId:
 *                     type: number
 *       500:
 *         description: Өгөгдөл авахад алдаа гарлаа.
 */

router.get("/products", async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    console.error("Products API алдаа:", error);
    res.status(500).send("Өгөгдөл авахад алдаа гарлаа.");
  }
});

export default router;