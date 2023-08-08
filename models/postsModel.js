// Los modelos de sequelize son equivalentes a la estructura de la tabla en MYSQL.
import { DataTypes } from "sequelize";
import sequelize from "../connections/db.js";

const Post = sequelize.define(
	"Post",
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		company: DataTypes.STRING,
		id_user: DataTypes.INTEGER, // INTEGER = INT
		email: DataTypes.STRING,
        title: DataTypes.STRING,
		content: DataTypes.STRING,
	},
	{
		tableName: "Post",
		timestamps: true, // Crea las columnas createdAt y updatedAt
	}
);

export default Post;