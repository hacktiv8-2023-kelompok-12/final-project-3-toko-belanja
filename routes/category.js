const controller = require("../controllers/category");
const midd = require("../middleware/auth");

const router = require("express").Router();
router.use(midd.isAuth);
router.use(midd.isAdmin);
router.post("/", controller.create);
router.get("/", controller.getAll);
router.patch("/:categoryId", controller.update);
router.delete("/:categoryId", controller.delete);

module.exports = router;