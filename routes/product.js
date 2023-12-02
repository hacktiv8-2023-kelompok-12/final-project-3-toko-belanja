const controller = require("../controllers/product");
const midd = require("../middleware/auth");

const router = require("express").Router();
router.use(midd.isAuth);
router.post("/", midd.isAdmin, controller.create);
router.get("/", controller.getAll);
router.put("/:productId", midd.isAdmin, controller.update);
router.patch("/:productId", midd.isAdmin, controller.patch);
router.delete("/:productId", midd.isAdmin, controller.delete);

module.exports = router;