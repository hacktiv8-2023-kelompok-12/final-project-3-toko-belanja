const controller = require("../controllers/product");
const midd = require("../middleware/auth");

const router = require("express").Router();
router.use(midd.isAuth);
router.use(midd.isAdmin);
router.post("/", controller.create);
router.get("/", controller.getAll);
router.put("/:productId", controller.update);
router.patch("/:productId", controller.patch);
router.delete("/:productId", controller.delete);

module.exports = router;