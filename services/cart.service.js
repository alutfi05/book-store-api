const { cart } = require("../models/cart.model");
var async = require("async");

const addCart = async (params, callback) => {
    if (!params.userId) {
        return callback({
            message: "User Id Required",
        });
    }

    cart.findOne({ userId: params.userId }, (err, cartDB) => {
        if (err) {
            return callback(err);
        } else {
            if (cartDB == null) {
                const cartModel = new cart({
                    userId: params.userId,
                    books: params.books,
                });

                cartModel
                    .save()
                    .then((response) => {
                        return callback(null, response);
                    })
                    .catch((error) => {
                        return callback(error);
                    });
            } else if (cartDB.books.length == 0) {
                cartDB.books = params.books;
                cartDB.save();

                return callback(null, cartDB);
            } else {
                async.eachSeries(params.books, (book, asyncDone) => {
                    let itemIndex = cartDB.books.findIndex(
                        (b) => b.book == book.book
                    );

                    if (itemIndex === -1) {
                        cartDB.books.push({
                            book: book.book,
                            qty: book.qty,
                        });

                        cartDB.save(asyncDone);
                    } else {
                        cartDB.books[itemIndex].qty =
                            cartDB.books[itemIndex].qty + book.qty;
                        cartDB.save(asyncDone);
                    }
                });

                return callback(null, cartDB);
            }
        }
    });
};

const getCart = async (params, callback) => {
    cart.findOne({ userId: params.userId })
        .populate({
            path: "books",
            populate: {
                path: "book",
                model: "Book",
                select: "bookTitle bookPrice bookSalePrice bookImage",
                populate: {
                    path: "category",
                    model: "Category",
                    select: "categoryName",
                },
            },
        })
        .then((response) => {
            return callback(null, response);
        })
        .catch((error) => {
            return callback(error);
        });
};

const removeCartItem = async (params, callback) => {
    cart.findOne({ userId: params.userId }, (err, cartDB) => {
        if (err) {
            callback(err);
        } else {
            if (params.bookId && params.qty) {
                const bookId = params.bookId;
                const qty = params.qty;

                if (cartDB.books.length == 0) {
                    return callback(null, "Cart empty!");
                } else {
                    let itemIndex = cartDB.books.findIndex(
                        (b) => b.book == bookId
                    );

                    if (itemIndex == -1) {
                        return callback(null, "Invalid Book!");
                    } else {
                        if (cartDB.books[itemIndex].qty == qty) {
                            cartDB.books.splice(itemIndex, 1);
                        } else if (cartDB.books[itemIndex].qty > qty) {
                            cartDB.books[itemIndex].qty =
                                cartDB.books[itemIndex].qty - qty;
                        } else {
                            return callback(null, "Enter lower Qty");
                        }

                        cartDB.save((err, cartM) => {
                            if (err) return callback(err);
                            return callback(null, "Cart Updated!");
                        });
                    }
                }
            }
        }
    });
};

module.exports = { addCart, getCart, removeCartItem };
