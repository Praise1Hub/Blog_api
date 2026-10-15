import bcrypt from 'bcryptjs';
import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const User = sequelize.define('User', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { notEmpty: true },
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { isEmail: true },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { len: [6, 100] },
    },
});

User.beforeSave(async (user) => {
    if (user.changed('password')) {
        user.password = await bcrypt.hash(user.password, 10);
    }
});

User.prototype.checkPassword = function (plainPassword) {
    return bcrypt.compare(plainPassword, this.password);
};

User.prototype.toJSON = function () {
    const values = { ...this.get() };
    delete values.password;
    return values;
};

export default User;
