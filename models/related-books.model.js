const mongoose = require("mongoose");

const relatedBook = mongoose.model(
    "RelatedBook",
    mongoose.Schema(
        {
            book: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Book",
            },
            relatedBook: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Book",
            },
        },
        {
            toJson: {
                transform: (doc, ret) => {
                    delete ret._id;
                    delete ret.__v;
                },
            },
            timestamp: true,
        }
    )
);

module.exports = { relatedBook };
