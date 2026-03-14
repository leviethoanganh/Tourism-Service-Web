const router = require('express').Router();
const categoryController = require("../../controllers/client/category.controller");

// Định nghĩa route cho danh sách tour theo danh mục (slug)
router.get('/:slug', categoryController.list);

module.exports = router;