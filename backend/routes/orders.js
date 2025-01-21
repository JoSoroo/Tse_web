
import express from "express";
import mongoose from "mongoose";  // mongoose импортлох
import Order from "../models/Order.js";


const router = express.Router();
// Захиалгыг бүртгэх API
/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Захиалга бүртгэх
 *     description: Бүтээгдэхүүний мэдээллийг сагсанд оруулж захиалга үүсгэнэ.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     product:
 *                       type: string
 *                     quantity:
 *                       type: number
 *                     price:
 *                       type: number
 *                     img:
 *                       type: string
 *                     description:
 *                       type: string
 *     responses:
 *       200:
 *         description: Захиалга амжилттай бүртгэгдлээ
 *       400:
 *         description: Сагс хоосон байна
 *       500:
 *         description: Захиалга бүртгэхэд алдаа гарлаа.
 */

router.post("/orders", async (req, res) => {
  const { items } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ message: "Сагс хоосон байна" });
  }

  try {
    const newOrder = new Order({ items });
    await newOrder.save();
    res.status(200).json({ message: "Захиалга амжилттай бүртгэгдлээ!" });
  } catch (error) {
    console.error("Захиалга бүртгэхэд алдаа:", error);
    res.status(500).json({ message: "Захиалга бүртгэхэд алдаа гарлаа." });
  }
});
// Захиалгуудыг авах API
/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Захиалгуудыг авах
 *     description: Өгөгдлийн сан дахь бүх захиалгуудыг авах.
 *     responses:
 *       200:
 *         description: Захиалгуудыг амжилттай авлаа
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   items:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         product:
 *                           type: string
 *                         quantity:
 *                           type: number
 *                         price:
 *                           type: number
 *                         img:
 *                           type: string
 *                         description:
 *                           type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *       500:
 *         description: Захиалгуудыг авахад алдаа гарлаа.
 */
router.get("/orders", async (req, res) => {
  try {
    const orders = await Order.find({});
    res.json(orders);
  } catch (error) {
    console.error("Захиалга авахад алдаа гарлаа:", error);
    res.status(500).json({ message: "Захиалга авахад алдаа гарлаа." });
  }
});
// Захиалгыг устгах API
/**
 * @swagger
 * /orders/{id}:
 *   delete:
 *     summary: Захиалгыг устгах
 *     description: Тодорхой захиалгыг түүний ID-ээр устгах.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Захиалгын ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Захиалгыг амжилттай устгагдлаа.
 *       400:
 *         description: Хэрэглэх боломжгүй ID
 *       404:
 *         description: Захиалгыг олж чадсангүй.
 *       500:
 *         description: Захиалга устгахад алдаа гарлаа.
 */

router.delete("/orders/:id", async (req, res) => {
  try {
    const orderId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ message: "Хэрэглэх боломжгүй ID" });
    }

    const order = await Order.findByIdAndDelete(orderId);
    if (!order) {
      return res.status(404).json({ message: "Захиалгыг олж чадсангүй." });
    }

    res.status(200).json({ message: "Захиалга амжилттай устгагдлаа." });
  } catch (error) {
    console.error("Захиалга устгахад алдаа гарлаа:", error);
    res.status(500).json({ message: "Захиалга устгахад алдаа гарлаа." });
  }
});

export default router;
