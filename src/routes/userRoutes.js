const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

router.post('/login', userController.login);
router.get('/refresh_token', userController.refreshToken);
router.post('/add', userController.addUser);

module.exports = router;
