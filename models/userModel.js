// Los modelos de sequelize son equivalentes a la estructura de la tabla en MYSQL.
import { DataTypes } from "sequelize";
import sequelize from "../connections/db.js";

// Definir usuario con nombre, apellidos, correo, contraseña y status
const User = sequelize.define(
	"User",
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		name: DataTypes.STRING,
		lastname: DataTypes.STRING,
		email: DataTypes.STRING,
		password: DataTypes.STRING,
		status: DataTypes.BOOLEAN,
	},
	{
		tableName: "User",
		timestamps: true, // Crea las columnas createdAt y updatedAt
	}
);

export default User;
