const {User} = require("../models");
const {sign_token, compare_hash} = require("../lib/crypto");

const formatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR"
});

function formatCurrency(val) {
    return formatter.format(val).replace('\xa0', ' ').split(",")[0];
}

module.exports = {
    register: async (req, res) => {
        try {
            const {full_name, password, gender, email} = req.body;
            const user = User.build({full_name, password, email, gender, balance: 0, role: "customer"});
            await user.validate().catch(() => {
                throw {
                    code: 400
                };
            });
            await user.save().catch(err => {
                if (err.name === "SequelizeUniqueConstraintError") {
                    throw {code: 409}
                }
                throw {code: 500, err}
            });
            res.status(201).json({
                user: {
                    ...user.dataValues,
                    balance: formatCurrency(user.balance),
                    role: undefined,
                    password: undefined,
                    updatedAt: undefined
                }
            });
        } catch (err) {
            console.log(err);
            if (err.code && typeof err.code === 'number') {
                return res.sendStatus(err.code);
            }
            res.sendStatus(500);
        }
    },
    login: async (req, res) => {
        try {
            const {email, password} = req.body;
            const user = await User.findOne({
                where: {
                    email
                }
            });
            if (!user) {
                throw {code: 400};
            }
            if (!(await compare_hash(user.password, password))) {
                throw {code: 400};
            }
            res.json({
                token: sign_token({id: user.id})
            });
        } catch (err) {
            if (err.code && typeof err.code === 'number') {
                return res.sendStatus(err.code);
            }
            res.sendStatus(500);
        }
    },
    update: async (req, res) => {
        try {
            const {id} = req.user;
            const {full_name, email} = req.body;
            let user = await User.findByPk(id, {});
            if (!user) {
                throw {code: 404};
            }
            if (full_name) {
                user.full_name = full_name;
            }
            if (email) {
                user.email = email;
            }
            await user.validate().catch((err) => {
                if (err.errors.length > 1) {
                    if (!err.errors.find(e => e.validatorKey === "len" && e.path === "password")) {
                        throw {code: 400};
                    }
                }
                return 1;
            });
            await User.update({
                full_name, email
            }, {
                where: {
                    id
                }
            });
            user = await User.findByPk(id, {});
            if (!user) {
                throw {code: 404};
            }
            res.json({
                user: {
                    id: user.id,
                    full_name: user.full_name,
                    email: user.email,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt
                }
            });
        } catch (err) {
            if (err.code && typeof err.code === 'number') {
                return res.sendStatus(err.code);
            }
            res.sendStatus(500);
        }
    },
    delete: async (req, res) => {
        try {
            const {id} = req.user;
            const user = await User.findByPk(id, {});
            if (!user) {
                throw {code: 404};
            }
            await user.destroy();
            res.json({
                message: "Your account has been successfully deleted"
            });
        } catch (err) {
            if (err.code && typeof err.code === 'number') {
                return res.sendStatus(err.code);
            }
            res.sendStatus(500);
        }
    },
    topup: async (req, res) => {
        try {
            const {id} = req.user;
            const {balance} = req.body;
            let user = await User.findByPk(id, {});
            if (!user) {
                throw {code: 404};
            }
            user.balance += balance;
            await user.validate().catch((err) => {
                if (err.errors.length > 1) {
                    if (!err.errors.find(e => e.validatorKey === "len" && e.path === "password")) {
                        throw {code: 400};
                    }
                }
                return 1
            });
            await User.update({
                balance: user.balance
            }, {
                where: {
                    id
                }
            });
            user = await User.findByPk(id, {});
            if (!user) {
                throw {code: 404};
            }
            res.json({
                message: `Your balance has been successfully updated to ${formatCurrency(user.balance)}`
            });
        } catch (err) {
            if (err.code && typeof err.code === 'number') {
                return res.sendStatus(err.code);
            }
            res.sendStatus(500);
        }
    }
}