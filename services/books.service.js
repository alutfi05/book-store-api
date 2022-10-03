const { book } = require("../models/book.model");
const { category } = require("../models/category.model");
const { MONGO_DB_CONFIG } = require("../config/app.config");

const createBook = async (params, callback) => {
    if (!params.bookTitle) {
        return callback(
            {
                message: "Book Title required",
            },
            ""
        );
    }

    if (!params.category) {
        return callback(
            {
                message: "Category required",
            },
            ""
        );
    }

    const bookModel = new book(params);
    bookModel
        .save()
        .then((response) => {
            return callback(null, response);
        })
        .catch((error) => {
            return callback(error);
        });
};

const getBooks = async (params, callback) => {
    const bookTitle = params.bookTitle;
    const categoryId = params.categoryId;
    var condition = {};

    if (bookTitle) {
        condition["bookTitle"] = {
            $regex: new RegExp(bookTitle),
            $options: "i",
        };
    }

    if (categoryId) {
        condition["category"] = categoryId;
    }

    let perPage = Math.abs(params.pageSize) || MONGO_DB_CONFIG.PAGE_SIZE;
    let page = (Math.abs(params.page) || 1) - 1;

    book.find(
        condition,
        "bookId bookTitle bookShortDescription bookPrice bookSalePrice bookImage bookType stockStatus"
    )
        .populate("category", "categoryName categoryImage")
        .limit(perPage)
        .skip(perPage * page)
        .then((response) => {
            return callback(null, response);
        })
        .catch((error) => {
            return callback(error);
        });
};

const getBookById = async (params, callback) => {
    const bookId = params.bookId;

    book.findById(bookId)
        .populate("category", "categoryName categoryImage")
        .then((response) => {
            return callback(null, response);
        })
        .catch((error) => {
            return callback(error);
        });
};

const updateBook = async (params, callback) => {
    const bookId = params.bookId;

    book.findByIdAndUpdate(bookId, params, { useFindAndModify: false })
        .then((response) => {
            if (!response) {
                callback(`Can't update Book with id ${bookId}`);
            } else {
                return callback(null, response);
            }
        })
        .catch((error) => {
            return callback(error);
        });
};

const deleteBook = async (params, callback) => {
    const bookId = params.bookId;

    book.findByIdAndRemove(bookId)
        .then((response) => {
            if (!response) {
                callback(`Can't delete Book with id ${bookId}`);
            } else {
                return callback(null, response);
            }
        })
        .catch((error) => {
            return callback(error);
        });
};

module.exports = { createBook, getBooks, getBookById, updateBook, deleteBook };
