require("dotenv").config();  // .env файл дээрх орчноос тохиргоог ачаална
const express = require("express");  // Express framework-ийг хэрэглэнэ
const cors = require("cors");  // CORS (Cross-Origin Resource Sharing)-ийг идэвхжүүлнэ
const bcrypt = require("bcrypt");  // Нууц үгийг хэшлэх модуль
const jwt = require("jsonwebtoken");  // JSON Web Token (JWT) ашиглах
const { Pool } = require("pg");  // PostgreSQL-тай ажиллах для PostgreSQL pool connection

const app = express();  // Express серверийг үүсгэнэ
const port = process.env.PORT || 3000;  // Серверийн порт, орчны тохиргоо эсвэл 3000 ашиглана
const swaggerUi = require("swagger-ui-express");  // Swagger UI ашиглах
const swaggerSpec = require("./swagger");  // Swagger-ийн тодорхойлолтыг импортлох
app.use(cors());  // CORS middleware-ийг бүх хандалтад ашиглана
app.use(express.json());  // Express серверт JSON өгөгдлийг хүлээн авдаг middleware ашиглана
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));  // Swagger API documentation-ийг тохируулна


// PostgreSQL pool connection
const pool = new Pool({
  user: process.env.DB_USER,  // PostgreSQL хэрэглэгчийн нэр
  host: process.env.DB_HOST,  // PostgreSQL серверийн хаяг
  database: process.env.DB_NAME,  // PostgreSQL өгөгдлийн сангийн нэр
  password: process.env.DB_PASSWORD,  // PostgreSQL хэрэглэгчийн нууц үг
  port: process.env.DB_PORT,  // PostgreSQL порт
});

// Middleware
app.use(cors());  // CORS middleware-ийг дахин ашиглах
app.use(express.json({ type: 'application/json; charset=UTF-8' }));  // JSON өгөгдлийг зөвшөөрөх middleware

// Register API
/**
 * @swagger
 * /register:
 *   post:
 *     summary: Шинэ хэрэглэгч бүртгэх
 *     description: Хэрэглэгчийн мэдээллийг хадгалах.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: Хэрэглэгчийн нэр.
 *                 example: johndoe
 *               email:
 *                 type: string
 *                 description: Хэрэглэгчийн имэйл.
 *               password:
 *                 type: string
 *                 description: Нууц үг.
 *     responses:
 *       201:
 *         description: Амжилттай бүртгэгдсэн.
 *       400:
 *         description: Буруу хүсэлт.
 */
app.post("/register", async (req, res) => {  // Хэрэглэгчийг бүртгэх API
  console.log("Register endpoint called with data:", req.body);  // Лог дээр хэрэглэгчийн өгөгдлийг хэвлэх

  try {
    const { username, email, password } = req.body;  // Шалгах өгөгдлийг авч байна

    if (!username || !email || !password) {  // Хэрэглэгчийн мэдээлэл дутагдсаныг шалгах
      console.log("Missing fields");  // Лог дээр харагдах дутагдлын мэдэгдэл
      return res.status(400).json({ message: "All fields are required" });  // Мэдээлэл дутуу бол алдаа илгээх
    }

    const hashedPassword = await bcrypt.hash(password, 10);  // Нууц үгийг хэшлэх
    console.log("Hashed password:", hashedPassword);  // Хэшлэгдсэн нууц үгийг хэвлэх

    const result = await pool.query(  // PostgreSQL дээр хэрэглэгчийг нэмэх
      "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email",
      [username, email, hashedPassword]
    );

    console.log("User registered successfully:", result.rows[0]);  // Бүртгэгдсэн хэрэглэгчийн мэдээллийг хэвлэх
    res.status(201).json({ message: "User registered successfully", user: result.rows[0] });  // Амжилттай бүртгэгдсэн гэж хариу өгөх
  } catch (err) {
    console.error("Error in /register:", err);  // Алдааны лог
    if (err.code === "23505") {  // Хэрэглэгчийн нэр эсвэл имэйл давхардсан тохиолдолд
      res.status(400).json({ message: "Username or email already exists" });  // Буруу хүсэлт
    } else {
      res.status(500).json({ message: "Internal server error", error: err.message });  // Дотоод серверийн алдаа
    }
  }
});

// Middleware function to authenticate the token
function authenticateToken(req, res, next) {  // JWT-ийн баталгаажуулалтыг шалгах middleware
    const authHeader = req.headers["authorization"];  // Authorization header-ийг авч байна
    const token = authHeader && authHeader.split(" ")[1];  // Token-ийг авч байна

    if (!token) {  // Token байхгүй бол алдаа илгээх
        return res.status(401).json({ message: "Access denied, no token provided" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {  // Token-г баталгаажуулах
        if (err) {  // Хэрэв алдаа гарвал
            return res.status(403).json({ message: "Invalid token" });  // Буцаах алдаа
        }
        req.user = user;  // Баталгаажсан хэрэглэгчийн мэдээллийг дамжуулах
        next();  // Дараагийн middleware руу шилжих
    });
}

// Login API
/**
 * @swagger
 * /login:
 *   post:
 *     summary: Хэрэглэгч нэвтрэх
 *     description: Нууц үгээ ашиглан системд нэвтрэх.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Хэрэглэгчийн имэйл.
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 description: Нууц үг.
 *                 example: secret123
 *     responses:
 *       200:
 *         description: Амжилттай нэвтэрсэн.
 *       401:
 *         description: Нууц үг буруу байна.
 */
app.post("/login", async (req, res) => {  // Нэвтрэх API
  const { email, password } = req.body;  // Имэйл болон нууц үгийг авч байна
  console.log("Login attempt with:", req.body.email, req.body.password);  // Лог дээр хэрэглэгчийн нэвтрэх оролдлогыг хэвлэх
  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);  // Имэйлээр хэрэглэгчийг хайх

    if (result.rows.length === 0) {  // Хэрэглэгч олдохгүй бол
      console.log("No user found with email:", email);  // Лог дээр бичих
      return res.status(404).json({ message: "User not found" });  // Хэрэглэгч олдохгүй гэсэн хариу
    }

    const user = result.rows[0];  // Олдсон хэрэглэгчийг авах
    const isPasswordMatch = await bcrypt.compare(password, user.password);  // Нууц үгийг хянах

    if (!isPasswordMatch) {  // Нууц үг тохирохгүй бол
      return res.status(401).json({ message: "Invalid credentials" });  // Хуурмаг мэдээлэл
    }

    const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, {  // JWT токен үүсгэх
      expiresIn: "1h",  // Токены хугацаа
    });

    res.status(200).json({ message: "Login successful", token });  // Амжилттай нэвтрэх хариу
  } catch (err) {
    console.error("Error in /login:", err);  // Алдааны лог
    res.status(500).json({ message: "Internal server error", error: err.message });  // Дотоод серверийн алдаа
  }
});

/**
 * @swagger
 * /product:
 *   get:
 *     summary: Бүтээгдэхүүний жагсаалт авах
 *     description: Нэвтэрсэн хэрэглэгчид зориулсан бүтээгдэхүүнүүдийн жагсаалт.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Бүтээгдэхүүний жагсаалт.
 *       401:
 *         description: Хандалтын эрхгүй.
 */
app.get("/product", authenticateToken, async (req, res) => {  // Бүтээгдэхүүний жагсаалт авах API
  try {
      const result = await pool.query("SELECT * FROM product");  // Бүтээгдэхүүнүүдийг авах SQL query

      // Консол дээр мэдээллийг хэвлэх
      console.log(result.rows);  // Хариу мэдээллийг хэвлэх

      res.status(200).json({ products: result.rows });  // Бүтээгдэхүүнүүдийг хариу илгээх
  } catch (err) {
      console.error("Error:", err.message);  // Алдаа гарсан үед хэвлэх
      res.status(500).json({ message: "Internal server error", error: err.message });  // Дотоод серверийн алдаа
  }
});

// Start server
app.listen(port, () => {  // Серверийг эхлүүлэх
  console.log(`Server is running on http://localhost:${port}`);  // Серверийн хаягийг хэвлэх
});
