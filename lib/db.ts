import { Sequelize } from "sequelize";

const db = new Sequelize({
  dialect: "mysql",
  host: process.env.DB_HOST || "localhost",
  username: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "jp",
  port: Number.parseInt(process.env.DB_PORT || "3306", 10),
  logging: false,
  define: {
    freezeTableName: true,
    underscored: true,
    timestamps: false,
  },
});

export default db;