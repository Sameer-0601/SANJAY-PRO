import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Plus, X, Save } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function InvoiceBuilder() {
  const { clients, apiAction, currency } = useAppContext();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    clientId: '',
    invoiceNumber: `INV-${Math.floor(Math.random() * 90000) + 10000}`,
    date: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    taxRate: 10,
    discountRate: 0,
    status: 'Pending'
  });

  const [items, setItems] = useState([{ id: 1, description: '', qty: 1, price: 0 }]);

  // Calculations
  const subtotal = items.reduce((acc, item) => acc + (item.qty * item.price), 0);
  const discount = (subtotal * formData.discountRate) / 100;
  const taxableAmount = subtotal - discount;
  const tax = (taxableAmount * formData.taxRate) / 100;
  const total = taxableAmount + tax;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.clientId) return alert("Select a client first");
    if (items.some(i => !i.description)) return alert("Fill out all item descriptions");

    const invoicePayload = {
      clientId: formData.clientId,
      invoiceNumber: formData.invoiceNumber,
      date: formData.date,
      dueDate: formData.dueDate,
      status: formData.status,
      items: items.map(({ description, qty, price }) => ({ description, qty, price })),
      subtotal, tax, discount, total
    };

    try {
      await apiAction.addInvoice(invoicePayload);
      navigate('/invoices');
    } catch (err) {
      console.error(err);
      alert('Failed to save invoice');
    }
  };

  const addItemRow = () => setItems([...items, { id: Date.now(), description: '', qty: 1, price: 0 }]);
  const updateItem = (id, field, value) => setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  const removeRow = (id) => { if (items.length > 1) setItems(items.filter(item => item.id !== id)); };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Create Invoice</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Fill out the details below to generate a new invoice.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Select Client</label>
                <select 
                  className="input-field appearance-none bg-white dark:bg-gray-800" 
                  value={formData.clientId}
                  required
                  onChange={e => setFormData({ ...formData, clientId: e.target.value })}
                >
                  <option value="" disabled>Choose a client...</option>
                  {clients.map(c => <option key={c._id} value={c._id}>{c.name} ({c.email})</option>)}
                </select>
              </div>
              <div className="flex gap-4">
                <div className="w-1/2">
                   <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Issue Date</label>
                   <input type="date" required className="input-field bg-white dark:bg-gray-800" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} />
                </div>
                <div className="w-1/2">
                   <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Due Date</label>
                   <input type="date" required className="input-field bg-white dark:bg-gray-800" value={formData.dueDate} onChange={e => setFormData({ ...formData, dueDate: e.target.value })} />
                </div>
              </div>
            </div>
            <div className="space-y-4 md:pl-8 md:border-l border-gray-100 dark:border-gray-700">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Invoice Number</label>
                <input type="text" required className="input-field font-mono font-bold text-gray-900 dark:text-white" value={formData.invoiceNumber} onChange={e => setFormData({ ...formData, invoiceNumber: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Status</label>
                <select className="input-field bg-white dark:bg-gray-800" value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}>
                   <option value="Draft">Draft</option>
                   <option value="Pending">Pending</option>
                   <option value="Paid">Paid</option>
                </select>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Items */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6 md:p-8">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Line Items ({currency.code})</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-12 gap-4 text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide border-b border-gray-100 dark:border-gray-700 pb-3 hidden sm:grid">
              <div className="col-span-6">Description</div>
              <div className="col-span-2 text-right">Qty</div>
              <div className="col-span-2 text-right">Price</div>
              <div className="col-span-2 text-right">Total</div>
            </div>
            {items.map(item => (
              <div key={item.id} className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center group mb-4 sm:mb-0">
                <div className="sm:col-span-6">
                  <input type="text" required placeholder="Item description" className="input-field bg-white dark:bg-gray-800 border-transparent hover:border-gray-200 dark:hover:border-gray-600 transition-colors" value={item.description} onChange={e => updateItem(item.id, 'description', e.target.value)} />
                </div>
                <div className="sm:col-span-2">
                  <input type="number" min="1" required className="input-field bg-white dark:bg-gray-800 text-right border-transparent hover:border-gray-200 dark:hover:border-gray-600 transition-colors" value={item.qty} onChange={e => updateItem(item.id, 'qty', parseInt(e.target.value) || 0)} />
                </div>
                <div className="sm:col-span-2 flex items-center relative gap-1">
                  <span className="absolute left-3 text-gray-400">{currency.symbol}</span>
                  <input type="number" min="0" step="0.01" required className="input-field pl-8 bg-white dark:bg-gray-800 text-right border-transparent hover:border-gray-200 dark:hover:border-gray-600 transition-colors" value={item.price} onChange={e => updateItem(item.id, 'price', parseFloat(e.target.value) || 0)} />
                </div>
                <div className="sm:col-span-2 text-right font-semibold text-gray-900 dark:text-white flex justify-end items-center gap-3 pr-2 mt-2 sm:mt-0">
                  {currency.symbol}{(item.qty * item.price).toFixed(2)}
                  <button type="button" onClick={() => removeRow(item.id)} className="text-gray-300 dark:text-gray-600 hover:text-red-500 dark:hover:text-red-400 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all focus:opacity-100 p-2">
                    <X size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button type="button" onClick={addItemRow} className="mt-6 flex items-center gap-2 text-sm font-semibold text-primary hover:text-secondary transition-colors px-3 py-2 bg-primary/5 dark:bg-primary/10 rounded-lg">
            <Plus size={16} /> Add new line item
          </button>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-end bg-gray-50/50 dark:bg-gray-800/30">
          <div className="w-full md:w-1/3 mb-6 md:mb-0 space-y-4">
             <div className="flex items-center gap-4">
               <label className="text-sm font-semibold text-gray-500 dark:text-gray-400 w-24">Tax (%)</label>
               <input type="number" min="0" max="100" className="input-field bg-white dark:bg-gray-800 flex-1" value={formData.taxRate} onChange={e => setFormData({ ...formData, taxRate: parseInt(e.target.value) || 0 })} />
             </div>
             <div className="flex items-center gap-4">
               <label className="text-sm font-semibold text-gray-500 dark:text-gray-400 w-24">Discount (%)</label>
               <input type="number" min="0" max="100" className="input-field bg-white dark:bg-gray-800 flex-1" value={formData.discountRate} onChange={e => setFormData({ ...formData, discountRate: parseInt(e.target.value) || 0 })} />
             </div>
          </div>

          <div className="w-full md:w-1/3 space-y-3 font-medium text-gray-700 dark:text-gray-300">
            <div className="flex justify-between border-b border-gray-100 dark:border-gray-700 pb-2">
              <span>Subtotal</span> <span className="font-semibold text-gray-900 dark:text-white">{currency.symbol}{subtotal.toFixed(2)}</span>
            </div>
            {formData.discountRate > 0 && (
              <div className="flex justify-between text-green-600 dark:text-green-400 pb-2">
                <span>Discount ({formData.discountRate}%)</span> <span>-{currency.symbol}{discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between border-b border-gray-100 dark:border-gray-700 pb-2">
              <span>Tax ({formData.taxRate}%)</span> <span>+{currency.symbol}{tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between pt-2 items-center">
              <span className="text-lg font-bold text-gray-900 dark:text-white">Total</span> 
              <span className="text-3xl font-extrabold text-primary">{currency.symbol}{total.toFixed(2)}</span>
            </div>
          </div>
        </motion.div>

        <div className="flex justify-end pt-4 pb-10">
           <button type="submit" className="btn-primary flex items-center gap-2 h-14 px-8 text-lg shadow-xl shadow-primary/20 dark:shadow-none">
             <Save size={20} /> Save & Generate Invoice
           </button>
        </div>
      </form>
    </div>
  );
}
