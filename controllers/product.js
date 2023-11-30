const {Product, Category} = require("../models");

const formatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR"
});

function formatCurrency(val) {
    return formatter.format(val).replace('\xa0', ' ').split(",")[0];
}

module.exports = {
    create: async (req, res) => {
        try {
            const {title, price, stock, CategoryId} = req.body;
            if (!(await Category.findByPk(CategoryId, {}))) {
                throw {code: 400};
            }
            const product = Product.build({title, price, stock, CategoryId});
            await product.validate().catch(() => {
                throw {code: 400};
            });
            await product.save();
            res.status(201).json({
                product: {
                    ...product.dataValues,
                    price: formatCurrency(product.price)
                }
            })
        } catch (err) {
            if (err.code && typeof err.code === 'number') {
                return res.sendStatus(err.code);
            }
            res.sendStatus(500);
        }
    },
    getAll: async (req, res) => {
        try {
            const products = await Product.findAll();
            res.json({
                products: products.map(product => ({
                    ...product.dataValues,
                    price: formatCurrency(product.price)
                }))
            });
        } catch (err) {
            res.sendStatus(500);
        }
    },
    update: async (req, res) => {
        try {
            const {productId: id} = req.params;
            const {price, stock, title} = req.body;
            let product = await Product.findByPk(id, {});
            if (!product) {
                throw {code: 404};
            }
            await Product.update({
                price, stock, title
            }, {
                where: {id}
            });
            product = await Product.findByPk(id, {});
            res.json({
                product: {
                    ...product.dataValues,
                    price: formatCurrency(product.price)
                }
            })
        } catch (err) {
            if (err.code && typeof err.code === 'number') {
                return res.sendStatus(err.code);
            }
            res.sendStatus(500);
        }
    },
    patch: async (req, res) => {
        try {
            const {productId: id} = req.params;
            const {CategoryId} = req.body;
            if (!CategoryId) {
                throw {code: 400};
            }
            let product = await Product.findByPk(id, {});
            if (!product) {
                throw {code: 404};
            }
            let category = await Category.findByPk(CategoryId, {});
            if (!category) {
                throw {code: 400};
            }
            await Product.update({
                CategoryId
            }, {
                where: {id}
            });
            product = await Product.findByPk(id, {});
            res.json({
                product: {
                    ...product.dataValues,
                    price: formatCurrency(product.price)
                }
            })
        } catch (err) {
            if (err.code && typeof err.code === 'number') {
                return res.sendStatus(err.code);
            }
            res.sendStatus(500);
        }
    },
    delete: async (req, res) => {
        try {
            const {productId: id} = req.params;
            const product = await Product.findByPk(id, {});
            if (!product) {
                throw {code: 404};
            }
            await product.destroy();
            res.json({
                message: "Product has been successfully deleted"
            });
        } catch (err) {
            console.log(err);
            if (err.code && typeof err.code === 'number') {
                return res.sendStatus(err.code);
            }
            res.sendStatus(500);
        }
    }
}