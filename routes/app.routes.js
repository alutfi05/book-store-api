const categoryController = require("../controllers/categories.controller");
const bookController = require("../controllers/books.controller");
const userController = require("../controllers/users.controller");
const sliderController = require("../controllers/slider.controller");
const relatedBookController = require("../controllers/related-book.controller");
const cartController = require("../controllers/cart.controller");
const orderController = require("../controllers/order.controller");
const { authenticateToken } = require("../middleware/auth");

const express = require("express");
const router = express.Router();

router.post("/category", categoryController.create);
router.get("/category", categoryController.findAll);
router.get("/category/:id", categoryController.findOne);
router.put("/category/:id", categoryController.update);
router.delete("/category/:id", categoryController.delete);

router.post("/book", bookController.create);
router.get("/book", bookController.findAll);
router.get("/book/:id", bookController.findOne);
router.put("/book/:id", bookController.update);
router.delete("/book/:id", bookController.delete);

router.post("/slider", sliderController.create);
router.get("/slider", sliderController.findAll);
router.get("/slider/:id", sliderController.findOne);
router.put("/slider/:id", sliderController.update);
router.delete("/slider/:id", sliderController.delete);

router.post("/register", userController.register);
router.post("/login", userController.login);

router.post("/relatedBook", relatedBookController.create);
router.delete("/relatedBook/:id", relatedBookController.delete);

router.post("/cart", [authenticateToken], cartController.create);
router.get("/cart", [authenticateToken], cartController.findAll);
router.delete("/cart", [authenticateToken], cartController.delete);

router.get("/order", [authenticateToken], orderController.findAll);
router.post("/order", [authenticateToken], orderController.create);
router.put("/order", [authenticateToken], orderController.update);

module.exports = router;
