const express = require('express');
const roleController = require('../controllers/roleController');

const router = express.Router();

router.post('/add', roleController.addRole);
router.post('/update', roleController.updateRole);
router.post('/delete', roleController.deleteRoles);

module.exports = router;
