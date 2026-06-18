import dotenv from "dotenv";
import sql from "mssql";

dotenv.config();

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : undefined,
  database: process.env.DB_DATABASE,
  options: {
    encrypt: false,
    trustServerCertificate: true,
    instanceName: process.env.DB_INSTANCE || undefined,
  },
};

let pool;

export async function getPool() {
  if (pool) {
    return pool;
  }

  pool = await sql.connect(config);
  console.log("Connected to SQL Server");
  return pool;
}

export { sql };
