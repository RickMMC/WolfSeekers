import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

// Initialize Sequelize
const sequelize = new Sequelize(
	process.env.MYSQL_ADDON_DB,
	process.env.MYSQL_ADDON_USER,
	process.env.MYSQL_ADDON_PASSWORD,
	{
		host: process.env.MYSQL_ADDON_HOST,
		port: parseInt(process.env.MYSQL_ADDON_PORT),
		dialect: "mysql",
		logging: false, // Establecer a false para desactivar los mensajes de sequelize
	}
);

sequelize
	.sync()
	.then(() => {
		console.info("Connected to My SQL");
	})
	.catch((e) => {
		console.error(`Error: ${e}`);
	});

export default sequelize;
