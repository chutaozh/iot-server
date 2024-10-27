const express = require('express');
const comboController = require('../controllers/comboController');

const router = express.Router();

router.post('/add', comboController.addCombo);
router.post('/update', comboController.updateCombo);
router.post('/update_status', comboController.updateComboStatus);
router.post('/delete', comboController.deleteCombos);
router.post('/copy', comboController.copyComboById);
router.get('/get', comboController.getComboById);
router.post('/list', comboController.getComboList);
router.get('/list_all', comboController.getAllComboList);

module.exports = router;
