const express = require('express');
const commonController = require('../controllers/commonController');

const router = express.Router();

router.get('/captcha', commonController.getCaptcha);
router.get('/address/provinces', commonController.getProvinceList);
router.get('/address/cities', commonController.getCityList);
router.get('/address/areas', commonController.getAreaList);
router.get('/address/streets', commonController.getStreetList);

module.exports = router;
