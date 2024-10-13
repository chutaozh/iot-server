const express = require('express');
const commonController = require('../controllers/commonController');

const router = express.Router();

router.get('/captcha', commonController.getCaptcha);

module.exports = router;
