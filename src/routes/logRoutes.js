const express = require('express');
const logController = require('../controllers/logController');

const router = express.Router();

router.post('/list', logController.getLogList);

module.exports = router;
