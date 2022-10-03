const mongoose = require("mongoose");

const book = mongoose.model(
    "Book",
    mongoose.Schema(
        {
            bookTitle: {
                type: String,
                required: true,
                unique: true,
            },
            category: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Category",
            },
            bookShortDescription: {
                type: String,
                required: true,
            },
            bookSynopsis: {
                type: String,
                required: true,
            },
            bookPrice: {
                type: Number,
                required: true,
            },
            bookSalePrice: {
                type: Number,
                required: true,
                default: 0,
            },
            bookImage: {
                type: String,
            },
            bookType: {
                type: String,
                required: true,
                default: "Sample",
            },
            stockStatus: {
                type: String,
                default: "IN",
            },
        },
        {
            toJSON: {
                transform: (doc, ret) => {
                    ret.bookId = ret._id.toString();
                    delete ret._id;
                    delete ret.__v;
                },
            },
        }
    )
);

module.exports = { book };
