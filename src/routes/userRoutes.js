const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

router.post('/login', userController.login);
router.get('/logout', userController.logout);
router.get('/refresh_token', userController.refreshToken);
router.post('/list', userController.getUserList);
router.get('/list_all', userController.getAllUserList);
router.post('/add', userController.addUser);
router.post('/update', userController.updateUser);
router.post('/delete', userController.deleteUsers);
router.post('/update_pwd', userController.updatePassword);
router.get('/my_profile', userController.getUserInfo);

module.exports = router;
