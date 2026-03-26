const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const clientsController = require('../controllers/clientsController');

// @route   GET api/clients
router.get('/', auth, clientsController.getClients);

// @route   POST api/clients
router.post('/', auth, clientsController.createClient);

// @route   PUT api/clients/:id
router.put('/:id', auth, clientsController.updateClient);

// @route   DELETE api/clients/:id
router.delete('/:id', auth, clientsController.deleteClient);

module.exports = router;
