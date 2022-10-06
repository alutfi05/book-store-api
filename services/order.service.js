const { user } = require("../models/user.model");
const { cards } = require("../models/cards.model");
const { order } = require("../models/order.model");

const stripeService = require("../services/stripe.service");
const cartService = require("../services/cart.service");

const createOrder = async (params, callback) => {
    user.findOne({ userId: params.userId }, async (err, userDB) => {
        if (err) {
            return callback(err);
        } else {
            var model = {};

            if (!userDB.stripeCustomerID) {
                await stripeService.createCustomer(
                    {
                        name: userDB.fullName,
                        email: userDB.email,
                    },
                    (error, results) => {
                        if (error) {
                            return callback(error);
                        }

                        if (results) {
                            userDB.stripeCustomerID = results.id;
                            userDB.save();

                            model.stripeCustomerID = results.id;
                        }
                    }
                );
            } else {
                model.stripeCustomerID = userDB.stripeCustomerID;
            }

            cards.findOne(
                {
                    customerId: model.stripeCustomerID,
                    cardNumber: params.card_Number,
                    cardExpMonth: params.card_ExpMonth,
                    cardExpYear: params.card_ExpYear,
                },
                async (err, cardDB) => {
                    if (err) {
                        return callback(err);
                    } else {
                        if (!cardDB) {
                            await stripeService.addCard(
                                {
                                    card_Name: params.card_Name,
                                    card_Number: params.card_Number,
                                    card_ExpMonth: params.card_ExpMonth,
                                    card_ExpYear: params.card_ExpYear,
                                    card_CVC: params.card_CVC,
                                    customer_Id: model.stripeCustomerID,
                                },
                                (error, results) => {
                                    if (error) {
                                        return callback(error);
                                    }

                                    if (results) {
                                        const cardModel = new cards({
                                            cardId: results.card,
                                            cardName: params.card_Name,
                                            cardNumber: params.card_Number,
                                            cardExpMonth: params.card_ExpMonth,
                                            cardExpYear: params.card_ExpYear,
                                            cardCVC: params.card_CVC,
                                            customerId: model.stripeCustomerID,
                                        });

                                        cardModel.save();
                                        model.cardId = results.card;
                                    }
                                }
                            );
                        } else {
                            model.cardId = cardDB.cardId;
                        }

                        await stripeService.generatePaymentIntent(
                            {
                                receipt_email: userDB.email,
                                amount: params.amount,
                                card_id: model.cardId,
                                customer_id: model.stripeCustomerID,
                            },
                            (error, results) => {
                                if (error) {
                                    return callback(error);
                                }

                                if (results) {
                                    model.paymentIntentId = results.id;
                                    model.client_secret = results.client_secret;
                                }
                            }
                        );

                        cartService.getCart(
                            { userId: userDB.id },
                            (err, cartDB) => {
                                if (err) {
                                    return callback(err);
                                } else {
                                    if (cartDB) {
                                        var books = [];
                                        var grandTotal = 0;

                                        cartDB.books.forEach((book) => {
                                            books.push({
                                                book: book.book._id,
                                                qty: book.qty,
                                                amount: book.book.bookSalePrice,
                                            });

                                            grandTotal +=
                                                book.book.bookSalePrice;
                                        });

                                        const orderModel = new order({
                                            userId: cartDB.userId,
                                            books: books,
                                            orderStatus: "pending",
                                            grandTotal: grandTotal,
                                        });

                                        orderModel
                                            .save()
                                            .then((response) => {
                                                model.orderId = response._id;
                                                return callback(null, model);
                                            })
                                            .catch((error) => {
                                                return callback(error);
                                            });
                                    }
                                }
                            }
                        );
                    }
                }
            );
        }
    });
};

const updateOrder = async (params, callback) => {
    var model = {
        orderStatus: params.status,
        transactionId: params.transaction_id,
    };

    order
        .findByIdAndUpdate(params.orderId, model, { useFindAndModify: false })
        .then((response) => {
            if (!response) {
                callback("Order Update Failed");
            } else {
                if (params.status == "success") {
                    // clear the cart
                }

                return callback(null, response);
            }
        })
        .catch((error) => {
            return callback(error);
        });
};

const getOrders = async (params, callback) => {
    order
        .findOne({
            userId: params.userId,
        })
        .populate({
            path: "books",
            populate: {
                path: "book",
                model: "Book",
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

module.exports = { createOrder, updateOrder, getOrders };
