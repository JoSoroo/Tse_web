import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();
// Нэвтрэх API
/**
 * @swagger
 * /admin:
 *   post:
 *     summary: Админы нэвтрэх
 *     description: Имэйл болон нууц үгийг шалгаж, JWT токен үүсгэнэ.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Амжилттай нэвтэрсэн
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 token:
 *                   type: string
 *                   example: "JWT_TOKEN"
 *       400:
 *         description: Мэдээлэл дутуу
 *       401:
 *         description: Алдаатай имэйл эсвэл нууц үг
 */

router.post("/admin", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email болон нууц үг шаардлагатай." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Хэрэглэгч олдсонгүй." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Нууц үг буруу байна." });
    }

    const token = jwt.sign({ userId: user._id }, "SecretKey", { expiresIn: "1h" });
    res.status(200).json({ success: true, token });
  } catch (error) {
    console.error("Алдаа:", error);
    res.status(500).json({ message: "Серверийн алдаа." });
  }
});
// Нууц үгийг шинэчлэх API
/**
 * @swagger
 * /admin/update-password:
 *   put:
 *     summary: Нууц үгийг шинэчлэх
 *     description: Хэрэглэгчийн ID болон шинэ нууц үгийг ашиглан тухайн хэрэглэгчийн нууц үгийг шинэчлэх.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: Хэрэглэгчийн ID
 *               newPassword:
 *                 type: string
 *                 description: Шинэ нууц үг
 *     responses:
 *       200:
 *         description: Нууц үг амжилттай шинэчлэгдлээ.
 *       400:
 *         description: Хэрэглэгчийн ID болон шинэ нууц үг шаардлагатай.
 *       500:
 *         description: Нууц үг шинэчлэхэд алдаа гарлаа.
 */

router.put("/admin/update-password", async (req, res) => {
  try {
    const { userId, newPassword } = req.body;

    if (!userId || !newPassword) {
      return res.status(400).json({ message: "Хэрэглэгчийн ID болон шинэ нууц үг шаардлагатай." });
    }
    // Нууц үгийг нууцлах
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    // Өгөгдлийн сан дээр шинэчилж оруулах
    await User.updateOne({ _id: userId }, // Хэрэглэгчийн ID-ийг ашиглан хайх
                    { $set: { password: hashedPassword } });// Нууцалсан  шинэ нууц үгийг хадгалах

    res.status(200).json({ message: "Нууц үг амжилттай шинэчлэгдлээ!" });
  } catch (error) {
    console.error("Нууц үг шинэчлэхэд алдаа гарлаа:", error);
    res.status(500).json({ message: "Нууц үг шинэчлэхэд алдаа гарлаа." });
  }
});

export default router;
