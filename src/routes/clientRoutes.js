const express = require('express');
const clientController = require('../controllers/clientController');

const router = express.Router();

router.post('/add', clientController.addClient);
router.post('/update', clientController.updateClient);
router.post('/delete', clientController.deleteClients);
router.get('/get', clientController.getClientById);
router.post('/list', clientController.getClientList);
router.get('/list_all', clientController.getAllClientList);

module.exports = router;
