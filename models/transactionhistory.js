'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class TransactionHistory extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            this.belongsTo(models.Product, {foreignKey: "ProductId"});
            this.belongsTo(models.User, {foreignKey: "UserId"});
        }
    }

    TransactionHistory.init({
        ProductId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        UserId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                isNumeric: true
            }
        },
        total_price: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                isNumeric: true
            }
        }
    }, {
        sequelize,
        modelName: 'TransactionHistory',
    });
    return TransactionHistory;
};