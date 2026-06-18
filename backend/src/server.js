import dotenv from "dotenv";
import app from "./app.js";
import { getPool } from "./config/db.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await getPool();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:");
    console.error(error);
    process.exit(1);
  }
}

startServer();
