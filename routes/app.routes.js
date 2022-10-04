const categoryController = require("../controllers/categories.controller");
const bookController = require("../controllers/books.controller");
const userController = require("../controllers/users.controller");
const sliderController = require("../controllers/slider.controller");
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

module.exports = router;
