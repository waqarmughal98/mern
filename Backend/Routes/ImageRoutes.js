const express = require("express");
const { uploadImage , getImages } = require("../Controllers/ImageController");
const ImageRouter = express.Router();
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now();
        cb(null, uniqueSuffix + file.originalname);
    },
});

const upload = multer({ storage: storage });

const Protect = require("../Middleware/AuthMiddleware");

ImageRouter.post("/upload-image", Protect, upload.single('image'), uploadImage);
ImageRouter.get("/get-images", Protect, getImages);

module.exports = ImageRouter;
