const {Category} = require("../models");

module.exports = {
    create: async (req, res) => {
        try {
            const {type} = req.body;
            const category = Category.build({
                type
            });
            await category.validate().catch(() => {
                throw {code: 400}
            });
            await category.save().catch(err => {
                if (err.name === "SequelizeUniqueConstraintError") {
                    throw {code: 409}
                }
                throw {code: 500, err}
            });
            res.status(201).json({category});
        } catch (err) {
            if (err.code && typeof err.code === 'number') {
                return res.sendStatus(err.code);
            }
            res.status(500);
        }
    },
    getAll: async (req, res) => {
        try {
            const categories = await Category.findAll();
            res.json({categories});
        } catch (err) {
            res.status(500);
        }
    },
    update: async (req, res) => {
        try {
            const {categoryId} = req.params;
            const {type} = req.body;
            const category = await Category.findByPk(categoryId, {});
            if (!category) {
                throw {code: 404};
            }
            category.type = type;
            await category.validate().catch(() => {
                throw {code: 400}
            });
            await category.save().catch(err => {
                if (err.name === "SequelizeUniqueConstraintError") {
                    throw {code: 409}
                }
                throw {code: 500, err}
            });
            res.json({category});
        } catch (err) {
            if (err.code && typeof err.code === 'number') {
                return res.sendStatus(err.code);
            }
            res.status(500);
        }
    },
    delete: async (req, res) => {
        try {
            const {categoryId} = req.params;
            const category = await Category.findByPk(categoryId, {});
            if (!category) {
                throw {code: 404};
            }
            await category.destroy();
            res.json({message: "Category has been successfully deleted"});
        } catch (err) {
            if (err.code && typeof err.code === 'number') {
                return res.sendStatus(err.code);
            }
            res.status(500);
        }
    }
}