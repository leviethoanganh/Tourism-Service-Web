const router = require('express').Router();

const TourController = require('../../controllers/client/tour.controller');

router.get ( '/detail/:slug' , TourController.detail )

module.exports = router;