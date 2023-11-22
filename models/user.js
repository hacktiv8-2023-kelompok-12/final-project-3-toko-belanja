'use strict';
const {
    Model
} = require('sequelize');
const {hash} = require("../lib/crypto");

module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            this.hasMany(models.TransactionHistory, {foreignKey: "UserId", onDelete: 'CASCADE'});
        }
    }

    User.init({
        full_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [6, 10]
            }
        },
        gender: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isIn: [["male", "female"]]
            }
        },
        role: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isIn: [["admin", "customer"]]
            }
        },
        balance: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                isNumeric: true,
                max: 100000000,
                min: 0
            }
        }
    }, {
        sequelize,
        modelName: 'User',
    });

    User.beforeSave("hash", async (user) => {
        user.password = await hash(user.password, 10);
    })
    return User;
};