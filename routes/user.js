const controller = require("../controllers/user");
const midd = require("../middleware/auth");

const router = require("express").Router();
router.post("/register", controller.register);
router.post("/login", controller.login);
router.put("/", midd.isAuth, controller.update);
router.delete("/", midd.isAuth, controller.delete);
router.patch("/", midd.isAuth, controller.topup);

module.exports = router;