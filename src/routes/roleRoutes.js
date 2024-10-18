const express = require('express');
const roleController = require('../controllers/roleController');

const router = express.Router();

router.post('/add', roleController.addRole);
router.post('/update', roleController.updateRole);
router.post('/delete', roleController.deleteRoles);
router.post('/list', roleController.getRoleList);
router.get('/list_all', roleController.getRoleListAll);

module.exports = router;
