const relatedBookServices = require("../services/related-books.service");

exports.create = (req, res, next) => {
    relatedBookServices.addRelatedBook(req.body, (error, results) => {
        if (error) {
            next(error);
        }

        return res.status(200).send({
            message: "Success",
            data: results,
        });
    });
};

exports.delete = (req, res, next) => {
    var model = {
        id: req.params.id,
    };

    relatedBookServices.removeRelatedBook(model, (error, results) => {
        if (error) {
            next(error);
        } else {
            return res.status(200).send({
                message: "Success",
                data: results,
            });
        }
    });
};
