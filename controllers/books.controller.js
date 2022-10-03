const bookService = require("../services/books.service");
const upload = require("../middleware/book.upload");

exports.create = (req, res, next) => {
    upload(req, res, (err) => {
        if (err) {
            next(err);
        } else {
            const path =
                req.file != undefined ? req.file.path.replace(/\\/g, "/") : "";

            var model = {
                bookTitle: req.body.bookTitle,
                category: req.body.category,
                bookShortDescription: req.body.bookShortDescription,
                bookSynopsis: req.body.bookSynopsis,
                bookPrice: req.body.bookPrice,
                bookSalePrice: req.body.bookSalePrice,
                bookType: req.body.bookType,
                stockStatus: req.body.stockStatus,
                bookImage: path != "" ? "/" + path : "",
            };

            bookService.createBook(model, (error, results) => {
                if (error) {
                    return next(error);
                } else {
                    return res.status(200).send({
                        message: "Success",
                        data: results,
                    });
                }
            });
        }
    });
};

exports.findAll = (req, res, next) => {
    var model = {
        bookTitle: req.query.bookTitle,
        categoryId: req.query.categoryId,
        pageSize: req.query.pageSize,
        page: req.query.page,
    };

    bookService.getBooks(model, (error, results) => {
        if (error) {
            return next(error);
        } else {
            return res.status(200).send({
                message: "Success",
                data: results,
            });
        }
    });
};

exports.findOne = (req, res, next) => {
    var model = {
        bookId: req.params.id,
    };

    bookService.getBookById(model, (error, results) => {
        if (error) {
            return next(error);
        } else {
            return res.status(200).send({
                message: "Success",
                data: results,
            });
        }
    });
};

exports.update = (req, res, next) => {
    upload(req, res, (err) => {
        if (err) {
            next(err);
        } else {
            const path =
                req.file != undefined ? req.file.path.replace(/\\/g, "/") : "";

            var model = {
                bookId: req.params.id,
                bookTitle: req.body.bookTitle,
                category: req.body.category,
                bookShortDescription: req.body.bookShortDescription,
                bookSynopsis: req.body.bookSynopsis,
                bookPrice: req.body.bookPrice,
                bookSalePrice: req.body.bookSalePrice,
                bookType: req.body.bookType,
                stockStatus: req.body.stockStatus,
                bookImage: path != "" ? "/" + path : "",
            };

            bookService.updateBook(model, (error, results) => {
                if (error) {
                    return next(error);
                } else {
                    return res.status(200).send({
                        message: "Success",
                        data: results,
                    });
                }
            });
        }
    });
};

exports.delete = (req, res, next) => {
    var model = {
        bookId: req.params.id,
    };

    bookService.deleteBook(model, (error, results) => {
        if (error) {
            return next(error);
        } else {
            return res.status(200).send({
                message: "Success",
                data: results,
            });
        }
    });
};
