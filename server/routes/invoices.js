const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const invoicesController = require('../controllers/invoicesController');

// @route   GET api/invoices
router.get('/', auth, invoicesController.getInvoices);

// @route   POST api/invoices
router.post('/', auth, invoicesController.createInvoice);

// @route   PUT api/invoices/:id
router.put('/:id', auth, invoicesController.updateInvoice);

// @route   DELETE api/invoices/:id
router.delete('/:id', auth, invoicesController.deleteInvoice);

module.exports = router;
