const multer = require("multer");
const Path = require("path");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads/sliders");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    },
});

const fileFilter = (req, file, cb) => {
    const fileExt = [".png", ".jpg", ".jpeg"];

    if (!fileExt.includes(Path.extname(file.originalname))) {
        return cb(new Error("Invalid File Type"));
    }

    const fileSize = parseInt(req.headers["content-length"]);

    if (fileSize > 1084576) {
        return cb(new Error("File Size to Big"));
    }

    cb(null, true);
};

let upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    fileSize: 1048576,
});

module.exports = upload.single("sliderImage");
