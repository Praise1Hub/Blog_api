import {DataTypes} from 'sequelize';
import sequelize from '../config/database.js';

const Comment = sequelize.define('Comment', {
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: { notEmpty: true },
    },
});

export default Comment;

