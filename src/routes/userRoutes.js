const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

router.post('/login', userController.login);
router.get('/refresh_token', userController.refreshToken);
router.post('/add', userController.addUser);
router.post('/update', userController.updateUser);
router.post('/delete', userController.deleteUsers);
router.post('/update_pwd', userController.updatePassword);
router.post('/my_profile', userController.getUserInfo);

module.exports = router;
