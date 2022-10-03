const multer = require("multer");
const Path = require("path");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads/books");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    },
});

const fileFilter = (req, file, cb) => {
    const validExts = [".png", ".jpg", ".jpeg"];
    if (!validExts.includes(Path.extname(file.originalname))) {
        return cb(new Error("Only .png, .jpg and.jpeg format allowed"));
    }

    const fileSize = parseInt(req.headers["content-length"]);

    if (fileSize > 1048576) {
        return cb(new Error("File image size to big"));
    }

    cb(null, true);
};

let upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    fileSize: 1048576,
});

module.exports = upload.single("bookImage");
