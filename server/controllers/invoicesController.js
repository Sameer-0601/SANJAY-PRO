const Invoice = require('../models/Invoice');

exports.getInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find({ userId: req.user.id }).populate('clientId', 'name email').sort({ date: -1 });
    res.json(invoices);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.createInvoice = async (req, res) => {
  const { clientId, invoiceNumber, items, subtotal, tax, discount, total, status, dueDate, date } = req.body;
  try {
    const newInvoice = new Invoice({
      userId: req.user.id,
      clientId, invoiceNumber, items, subtotal, tax, discount, total, status, dueDate, date
    });
    const invoice = await newInvoice.save();
    const populatedInvoice = await Invoice.findById(invoice._id).populate('clientId', 'name email');
    res.json(populatedInvoice);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.updateInvoice = async (req, res) => {
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
};

exports.deleteInvoice = async (req, res) => {
  try {
    let invoice = await Invoice.findById(req.params.id);
    if (!invoice) return res.status(404).json({ msg: 'Invoice not found' });
    if (invoice.userId.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });

    await Invoice.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Invoice removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
