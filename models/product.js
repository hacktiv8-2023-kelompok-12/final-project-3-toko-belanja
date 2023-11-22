'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Product extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            this.belongsTo(models.Category, {foreignKey: "CategoryId"});
            this.hasMany(models.TransactionHistory, {foreignKey: "ProductId", onDelete: 'CASCADE'});
        }
    }

    Product.init({
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        price: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                isNumeric: true,
                max: 50000000,
                min: 0
            }
        },
        stock: {
            type: DataTypes.INTEGER,
            validate: {
                isNumeric: true,
                min: 5
            }
        },
        CategoryId: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'Product',
    });
    return Product;
};