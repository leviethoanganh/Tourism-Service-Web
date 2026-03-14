const router = require('express').Router();

const HomeController = require('../../controllers/client/home.controller');

router.get('/', HomeController.list);

module.exports = router;