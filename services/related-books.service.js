const { relatedBook } = require("../models/related-books.model");
const { book } = require("../models/book.model");

const addRelatedBook = async (params, callback) => {
    if (!params.book) {
        return callback({
            message: "Book Id Required",
        });
    }

    if (!params.relatedBook) {
        return callback({
            message: "Related Book Id Required",
        });
    }

    const relatedBookModel = new relatedBook(params);
    relatedBookModel
        .save()
        .then(async (response) => {
            await book.findOneAndUpdate(
                {
                    _id: params.book,
                },
                {
                    $addToSet: {
                        relatedBooks: relatedBookModel,
                    },
                }
            );
            return callback(null, response);
        })
        .catch((error) => {
            return callback(error);
        });
};

const removeRelatedBook = async (params, callback) => {
    const id = params.id;

    relatedBook
        .findByIdAndRemove(id)
        .then((response) => {
            if (!response) {
                callback("Book Id not found");
            } else {
                return callback(null, response);
            }
        })
        .catch((error) => {
            return callback(error);
        });
};

module.exports = { addRelatedBook, removeRelatedBook };
