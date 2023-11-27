const {Product, User, TransactionHistory: History, Category, sequelize} = require("../models");

const formatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR"
});

function formatCurrency(val) {
    return formatter.format(val).replace('\xa0', ' ').split(",")[0];
}

module.exports = {
    create: async (req, res) => {
        const tx = await sequelize.transaction();
        try {
            const {id: UserId, balance} = req.user;
            const {productId: ProductId, quantity} = req.body;
            const product = await Product.findByPk(ProductId, {include: [Category]});
            if (!product) {
                throw {code: 404};
            }
            if (product.stock < quantity) {
                throw {code: 404}
            }
            if (balance < product.price * quantity) {
                throw {code: 400}
            }
            product.stock -= quantity;
            await product.save();
            await Category.update({
                sold_product_amount: product.Category.sold_product_amount + quantity
            }, {
                where: {
                    id: product.CategoryId
                }
            });
            await User.update({
                balance: balance - product.price * quantity
            }, {
                where: {
                    id: UserId
                }
            });
            await History.create({
                ProductId,
                UserId,
                quantity,
                total_price: product.price * quantity
            });
            await tx.commit();
            res.json({
                message: "You have successfully purchase the product",
                transactionBill: {
                    total_price: formatCurrency(product.price * quantity),
                    quantity,
                    product_name: product.title
                }
            });
        } catch (err) {
            await tx.rollback();
            if (err.code && typeof err.code === 'number') {
                return res.sendStatus(err.code);
            }
            res.sendStatus(500);
        }
    },
    getMy: async (req, res) => {
        try {
            const {id: UserId} = req.user;
            const histories = await History.findAll({
                where: {
                    UserId
                },
                attributes: {exclude: ["id"]},
                include: [
                    {
                        model: Product,
                        attributes: {exclude: ["createdAt", "updatedAt"]}
                    }
                ]
            });
            res.json({
                transactionHistories: histories.map(history => {
                    history.total_price = formatCurrency(history.total_price);
                    history.Product.price = formatCurrency(history.Product.price);
                    return history;
                })
            });
        } catch (err) {
            console.log(err);
            res.sendStatus(500);
        }
    }
}