import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import productRoutes from "./routes/product.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import supplierRoutes from "./routes/supplier.routes.js";
import stockRoutes from "./routes/stock.routes.js";
import reportRoutes from "./routes/report.routes.js";
import {
  notFoundHandler,
  errorHandler,
} from "./middleware/error.middleware.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
  }),
);

app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ message: "PharmaStock API is running" });
});

app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/suppliers", supplierRoutes);
app.use("/api/stock-operations", stockRoutes);
app.use("/api/reports", reportRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
