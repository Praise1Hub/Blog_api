import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

export const User = require('./user')(sequelize, DataTypes);
export const Post = require('./post')(sequelize, DataTypes);
export const Comment = require('./comment')(sequelize, DataTypes);

//User <-> Post
User.hasMany(Post, { foreignKey: 'userId', as: 'posts', onDelete: 'CASCADE' });
Post.belongsTo(User, { foreignKey: 'userId', as: 'author' });

//Post <-> Comment
Post.hasMany(Comment, { foreignKey: 'postId', as: 'comments', onDelete: 'CASCADE' });
Comment.belongsTo(Post, { foreignKey: 'postId', as: 'post' });  

//User <-> Comment
User.hasMany(Comment, { foreignKey: 'userId', as: 'comments', onDelete: 'CASCADE' });
Comment.belongsTo(User, { foreignKey: 'userId', as: 'author' });

// export default {sequelize, User, Post, Comment };