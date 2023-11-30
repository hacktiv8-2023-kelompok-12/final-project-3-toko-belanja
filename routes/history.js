const controller = require("../controllers/history");
const midd = require("../middleware/auth");

const router = require("express").Router();
router.use(midd.isAuth);
router.post("/", controller.create);
router.get("/user", controller.getMy);
router.get("/admin", midd.isAdmin, controller.getAll);
router.get("/:transactionId", controller.getOne);

module.exports = router;