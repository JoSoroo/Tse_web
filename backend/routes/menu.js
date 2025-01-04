import express from "express";
import Menu from "../models/Menu.js";

const router = express.Router();
// Цэс авах API
/**
 * @swagger
 * /menu:
 *   get:
 *     summary: Цэс авах
 *     description: Өгөгдлийн сан дахь бүх цэсийн мэдээллийг авах.
 *     responses:
 *       200:
 *         description: Цэсийн мэдээлэл амжилттай авлаа.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: number
 *                   title:
 *                     type: string
 *       500:
 *         description: Өгөгдөл авахад алдаа гарлаа.
 */

router.get("/menu", async (req, res) => {
  try {
    const menu = await Menu.find({});
    res.json(menu);
  } catch (error) {
    console.error("Menu API алдаа:", error);
    res.status(500).send("Өгөгдөл авахад алдаа гарлаа.");
  }
});

export default router; // Default экспорт нэмэх
