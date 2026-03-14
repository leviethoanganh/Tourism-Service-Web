const express = require("express");
const router = express.Router();

const uploadController = require("../../controllers/admin/upload.controller");
const cloudinaryHelper = require("../../helpers/cloudinary.helper");
const multer = require("multer");

const upload = multer({ storage: cloudinaryHelper.Storage });

router.post(
    "/image",
    upload.single('file'),
    uploadController.imagePost
);

module.exports = router;