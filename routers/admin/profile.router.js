const express = require("express");
const router = express.Router();
const profileController = require("../../controllers/admin/profile.controller");
const cloudinaryHelper = require("../../helpers/cloudinary.helper");
const multer = require('multer');

const upload = multer({ 
    storage: cloudinaryHelper.storage 
});

router.get('/edit', profileController.edit);

router.patch(
    '/edit', 
    upload.single("avatar"), 
    profileController.editPatch
);

router.get('/change-password', profileController.changePassword);

router.patch(
    '/change-password', 
    upload.none(), 
    profileController.changePasswordPatch
);

module.exports = router;