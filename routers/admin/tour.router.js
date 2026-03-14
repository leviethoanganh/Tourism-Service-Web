const express = require("express");
const router = express.Router();
const tourController = require("../../controllers/admin/tour.controller");
const cloudinaryHelper = require("../../helpers/cloudinary.helper");
const tourValidate = require("../../validates/admin/tour.validate");
const multer = require('multer');

// Cấu hình Multer để sử dụng bộ lưu trữ (storage) từ Cloudinary helper
const upload = multer({ 
    storage: cloudinaryHelper.storage 
});

router.get("/list", tourController.list);

router.get("/create", tourController.create);

router.post(
    '/create',
    upload.fields([
        { name: "avatar", maxCount: 1 },
        { name: "images", maxCount: 10 }
    ]),
    tourValidate.createPost,
    tourController.createPost
);

router.get('/edit/:id', tourController.edit)

router.patch(
    '/edit/:id',
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "images",
            maxCount: 10
        }
    ]),
    tourValidate.createPost, // Hoặc một middleware validate dành riêng cho edit
    tourController.editPatch
);

router.patch('/delete/:id', tourController.deletePatch)

router.patch('/undo/:id', tourController.undoPatch)

router.patch ('/undo/:id' , tourController.undoPatch) 

router.delete ( '/destroy/:id' , tourController.destroyDel )

router.get("/trash", tourController.trash);

module.exports = router;