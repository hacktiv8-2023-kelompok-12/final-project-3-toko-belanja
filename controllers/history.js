const {Product, User, TransactionHistory: History, Category, sequelize} = require("../models");

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
                    total_price: new Intl.NumberFormat("id-ID",{
                        style: "currency",
                        currency: "IDR"
                    }).format(product.price * quantity).replace('\xa0', ' ').split(",")[0],
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
    }
}