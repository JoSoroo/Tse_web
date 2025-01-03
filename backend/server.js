// веб серверийн фреймворк бөгөөд HTTP хүсэлтүүдийг боловсруулах
const express = require("express");
const mongoose = require("mongoose");
//алдааг засах үед 
const cors = require("cors");
//Нууц үг хадгалах үед 
const bcrypt = require("bcrypt");
// JSON Web Token ашиглан аюулгүй нэвтрэх / баталгаажуулах системийг хэрэгжүүлдэг.
const jwt = require("jsonwebtoken");
const swaggerJSDoc = require("swagger-jsdoc");

//Express серверийг эхлүүлэхэд ашиглагддаг үндсэн объект.
const app = express();
const PORT = 5000;

// MongoDB холболт
mongoose.connect("mongodb://localhost:27017/Tse_db", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB холболтын алдаа:"));
db.once("open", () => {
  console.log("MongoDB холбогдлоо!");
});

// Модель тодорхойлох
//Хэрэглэгчийн имэйл болон нууц үгийг хадгалах схем. Имэйл нь цор ганц байх ёстой.
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});
//Цэсийн мэдээллийг хадгалах схем.
const MenuSchema = new mongoose.Schema({
  _id: Number,
  title: String,
});
// Бүтээгдэхүүний мэдээллийг хадгалах схем. Энэ нь бүтээгдэхүүний нэр, үнэ, болон цэсийн ID-г хадгална.
const ProductSchema = new mongoose.Schema({
  _id: Number,
  name: String,
  price: Number,
  menuId: Number, // Холбогдох цэсийн ID
});
//Захиалга. Энэ нь захиалгын бүтээгдэхүүний нэр, тоо, үнэ, зураг болон тайлбар зэргийг хадгална.
const orderSchema = new mongoose.Schema({
  items: [
      {
          product: { type: String, required: true }, // Бүтээгдэхүүний нэр
          quantity: { type: Number, required: true }, // Тоо
          price: { type: Number, required: true }, // Үнэ
          img: { type: String, default: '' }, // Бүтээгдэхүүний зураг
          description: { type: String, default: '' }, // Бүтээгдэхүүний тайлбар
      }
  ],
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model("User", UserSchema);
const Menu = mongoose.model("Menu", MenuSchema, "menu");
const Product = mongoose.model("Product", ProductSchema);
const Order = mongoose.model("Order", orderSchema);

// Swagger-ийн тохиргоог энд хийлээ
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Documentation",
      version: "1.0.0",
      description: "Таны API-ийн тайлбар",
    },
    servers: [
      {
        url: "http://localhost:5000",
      },
    ],
  },
  apis: ["./server.js"], // Таны API тайлбаруудыг агуулсан файлууд
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);



// сервер нь өөр домэйнээс ирсэн хүсэлтүүдийг зөвшөөрөх боломжийг олгодог.
app.use(cors());
//JSON форматтай өгөгдлийг серверт хүлээн авч боловсруулах боломжийг олгодог middleware./
app.use(express.json());

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
app.post("/admin", async (req, res) => {
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

      const token = jwt.sign({ userId: user._id }, "yourSecretKey", { expiresIn: "1h" });
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
app.put("/admin/update-password", async (req, res) => {
  try {
    const { userId, newPassword } = req.body;
    console.log('Нэвтрэх оролдлого:', req.body);

    if (!userId || !newPassword) {
      return res.status(400).json({ message: "Хэрэглэгчийн ID болон шинэ нууц үг шаардлагатай." });
    }

    // Нууц үгийг нууцлах
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Өгөгдлийн сан дээр шинэчилж оруулах
    await User.updateOne(
      { _id: userId },  // Хэрэглэгчийн ID-ийг ашиглан хайх
      { $set: { password: hashedPassword } }  // Нууцалсан  шинэ нууц үгийг хадгалах
    );

    res.status(200).json({ message: "Нууц үг амжилттай шинэчлэгдлээ!" });
  } catch (error) {
    console.error('Нууц үг шинэчлэхэд алдаа гарлаа:', error);
    res.status(500).json({ message: "Нууц үг шинэчлэхэд алдаа гарлаа." });
  }
});

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
app.post('/orders', async (req, res) => {
  const { items } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ message: 'Сагс хоосон байна' });
  }

  try {
    const newOrder = new Order({ items });
    await newOrder.save(); //Шинэ захиалгыг өгөгдлийн санд хадгална.
    res.status(200).json({ message: 'Захиалга амжилттай бүртгэгдлээ!' });
  } catch (error) {
    console.error('Захиалга бүртгэхэд алдаа:', error);
    res.status(500).json({ message: 'Захиалга бүртгэхэд алдаа гарлаа.' });
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
app.get("/orders", async (req, res) => {
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
app.delete("/orders/:id", async (req, res) => {
  try {
    const orderId = req.params.id; // Захиалгын ID
    console.log("Received orderId:", orderId); 
    const order = await Order.findByIdAndDelete(orderId); // ID-ээр нь захиалгыг устгах

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ message: "Хэрэглэх боломжгүй ID" });
  }
    if (!order) {
      return res.status(404).json({ message: "Захиалгыг олж чадсангүй." });
    }

    res.status(200).json({ message: "Захиалга амжилттай устгагдлаа." });
  } catch (error) {
    console.error("Захиалга устгахад алдаа гарлаа:", error);
    res.status(500).json({ message: "Захиалга устгахад алдаа гарлаа." });
  }
});

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
app.get("/menu", async (req, res) => {
  try {
    const menu = await Menu.find({});
    res.json(menu);
  } catch (error) {
    console.error("Menu API алдаа:", error);
    res.status(500).send("Өгөгдөл авахад алдаа гарлаа.");
  }
});

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
app.get("/products", async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).send("Өгөгдөл авахад алдаа гарлаа.");
  }
});

// Серверийг ажиллуулах
app.listen(PORT, () => {
  console.log(`Сервер http://localhost:${PORT} дээр ажиллаж байна.`);
});
