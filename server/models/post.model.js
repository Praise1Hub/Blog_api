import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";


  const Post = sequelize.define("Post", {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { notEmpty: true },
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    published: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
});

export default Post;
