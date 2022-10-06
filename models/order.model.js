const mongoose = require("mongoose");

const order = mongoose.model(
    "Order",
    mongoose.Schema(
        {
            userId: {
                type: String,
                required: true,
            },
            books: [
                {
                    book: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "Book",
                        required: true,
                    },
                    amount: {
                        type: Number,
                        required: true,
                    },
                    qty: {
                        type: Number,
                        required: true,
                    },
                },
            ],
            grandTotal: {
                type: Number,
                required: true,
            },
            orderStatus: {
                type: String,
                required: true,
            },
            transactionId: {
                type: String,
            },
        },
        {
            timestamps: true,
        }
    )
);

module.exports = { order };
