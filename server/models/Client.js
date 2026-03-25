const mongoose = require('mongoose');

const ClientSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  address: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Client', ClientSchema);
