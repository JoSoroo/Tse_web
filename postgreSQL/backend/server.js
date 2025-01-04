require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Pool } = require("pg");

const app = express(); // `app` обьектыг энд тодорхойлно
const port = process.env.PORT || 3000;
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");
app.use(cors());
app.use(express.json());  // Энэ тохиргоог зөв байрлуулсан эсэхийг шалгана уу
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));


// PostgreSQL pool connection
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Middleware
app.use(cors()); // `cors` middleware-ийг энд байрлуулна
app.use(express.json({ type: 'application/json; charset=UTF-8' })); // JSON data-тай ажиллах middleware

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
app.post("/register", async (req, res) => {
  console.log("Register endpoint called with data:", req.body); // Лог нэмэх

  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      console.log("Missing fields"); // Лог нэмэх
      return res.status(400).json({ message: "All fields are required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Hashed password:", hashedPassword); // Лог нэмэх

    const result = await pool.query(
      "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email",
      [username, email, hashedPassword]
    );

    console.log("User registered successfully:", result.rows[0]); // Лог нэмэх
    res.status(201).json({ message: "User registered successfully", user: result.rows[0] });
  } catch (err) {
    console.error("Error in /register:", err); // Алдааны лог
    if (err.code === "23505") {
      res.status(400).json({ message: "Username or email already exists" });
    } else {
      res.status(500).json({ message: "Internal server error", error: err.message });
    }
  }
});


// Middleware function to authenticate the token
function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Access denied, no token provided" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Invalid token" });
        }
        req.user = user;
        next();
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
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log("Login attempt with:", req.body.email, req.body.password);
  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

    if (result.rows.length === 0) {
      console.log("No user found with email:", email);  // Лог нэмэх
      return res.status(404).json({ message: "User not found" });
    }

    const user = result.rows[0];
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    console.error("Error in /login:", err);  // Алдааны лог
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
});
/**
 * @swagger
 * /products:
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
app.get("/product", authenticateToken, async (req, res) => {
  try {
      const result = await pool.query("SELECT * FROM product");

      // Консол дээр мэдээллийг хэвлэх
      console.log(result.rows);  // Хариу мэдээллийг хэвлэх

      res.status(200).json({ products: result.rows });
  } catch (err) {
      console.error("Error:", err.message);  // Алдаа гарсан үед хэвлэх
      res.status(500).json({ message: "Internal server error", error: err.message });
  }
});




// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
