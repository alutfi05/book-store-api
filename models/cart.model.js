const mongoose = require("mongoose");

const cart = mongoose.model(
    "Cart",
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
                    qty: {
                        type: Number,
                        required: true,
                    },
                },
            ],
        },
        {
            toJSON: {
                transform: (model, ret) => {
                    ret.cartId = ret._id.toString();
                    delete ret._id;
                    delete ret.__v;
                },
            },
        },
        {
            timestamps: true,
        }
    )
);

module.exports = { cart };
