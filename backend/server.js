// веб серверийн фреймворк бөгөөд HTTP хүсэлтүүдийг боловсруулах
import express from "express";
//алдааг засах үед 
import cors from "cors";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import authRoutes from "./routes/auth.js";
import orderRoutes from "./routes/orders.js";
import menuRoutes from "./routes/menu.js";
import productRoutes from "./routes/products.js";

//Express серверийг эхлүүлэхэд ашиглагддаг үндсэн объект.
const app = express();
const PORT = 5000;

// Swagger-ийн тохиргоог
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Documentation",
      version: "1.0.0",
      description: " API-ийн тайлбар",
    },
    servers: [
      {
        url: "http://localhost:5000",
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);

app.use(cors());
app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use(authRoutes);
app.use(orderRoutes);
app.use(menuRoutes);
app.use(productRoutes);

app.listen(PORT, () => {
  console.log(`Сервер http://localhost:${PORT} дээр ажиллаж байна.`);
});
