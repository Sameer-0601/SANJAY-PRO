const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Invoice = require('../models/Invoice');

// @route   GET api/invoices
router.get('/', auth, async (req, res) => {
  try {
    const invoices = await Invoice.find({ userId: req.user.id }).populate('clientId', 'name email').sort({ date: -1 });
    res.json(invoices);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/invoices
router.post('/', auth, async (req, res) => {
  const { clientId, invoiceNumber, items, subtotal, tax, discount, total, status, dueDate, date } = req.body;
  try {
    const newInvoice = new Invoice({
      userId: req.user.id,
      clientId, invoiceNumber, items, subtotal, tax, discount, total, status, dueDate, date
    });
    const invoice = await newInvoice.save();
    // populate client details before returning
    const populatedInvoice = await Invoice.findById(invoice._id).populate('clientId', 'name email');
    res.json(populatedInvoice);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/invoices/:id
router.put('/:id', auth, async (req, res) => {
  try {
    let invoice = await Invoice.findById(req.params.id);
    if (!invoice) return res.status(404).json({ msg: 'Invoice not found' });
    if (invoice.userId.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });

    invoice = await Invoice.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true }).populate('clientId', 'name email');
    res.json(invoice);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/invoices/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    let invoice = await Invoice.findById(req.params.id);
    if (!invoice) return res.status(404).json({ msg: 'Invoice not found' });
    if (invoice.userId.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });

    await Invoice.findByIdAndRemove(req.params.id);
    res.json({ msg: 'Invoice removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
