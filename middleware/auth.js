const {User} = require("../models");
const {verify_token} = require("../lib/crypto");

module.exports = {
    isAuth: async (req, res, next) => {
        try {
            const {token} = req.headers;
            if (!token) {
                throw {
                    code: 401
                };
            }
            const claim = await verify_token(token).catch(() => {
                throw {
                    code: 401
                };
            });
            if (!claim) {
                throw {
                    code: 401
                };
            }
            req.user = await User.findByPk(claim.id, {});
            if (!req.user) {
                throw {
                    code: 401
                };
            }
            next();
        } catch (err) {
            res.sendStatus(err.code || 500);
        }
    },
    isAdmin: (req, res, next) => {
        if(req.user.role === "admin") {
            return next();
        }
        res.sendStatus(403);
    }
}