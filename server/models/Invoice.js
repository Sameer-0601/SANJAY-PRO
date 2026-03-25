const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  description: { type: String, required: true },
  qty: { type: Number, required: true, default: 1 },
  price: { type: Number, required: true, default: 0 },
});

const InvoiceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
  invoiceNumber: { type: String, required: true },
  items: [ItemSchema],
  subtotal: { type: Number, required: true, default: 0 },
  tax: { type: Number, required: true, default: 0 },
  discount: { type: Number, required: true, default: 0 },
  total: { type: Number, required: true, default: 0 },
  status: { type: String, enum: ['Paid', 'Pending', 'Draft'], default: 'Pending' },
  date: { type: Date, default: Date.now },
  dueDate: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Invoice', InvoiceSchema);
