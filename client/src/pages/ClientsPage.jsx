import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Edit } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function ClientsPage() {
  const { clients, apiAction } = useAppContext();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', address: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await apiAction.addClient(formData);
    setFormData({ name: '', email: '', phone: '', address: '' });
    setShowForm(false);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Clients</h1>
          <p className="text-gray-500 mt-1">Manage your customer relationships and contacts.</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center gap-2 shadow-sm">
          <Plus size={18} /> Add Client
        </button>
      </div>

      {showForm && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mb-8">
          <form onSubmit={handleSubmit} className="glass-card p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Company / Name</label>
              <input type="text" required className="input-field" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
              <input type="email" required className="input-field" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Phone</label>
              <input type="text" className="input-field" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Address</label>
              <input type="text" className="input-field" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
            </div>
            <div className="md:col-span-2 flex justify-end gap-3 mt-4">
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 font-medium text-gray-600 hover:text-gray-900">Cancel</button>
              <button type="submit" className="btn-primary">Save Client</button>
            </div>
          </form>
        </motion.div>
      )}

      <div className="glass-card overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-sm font-semibold uppercase tracking-wider">
              <th className="p-4 pl-6">Client Name</th>
              <th className="p-4">Contact info</th>
              <th className="p-4">Address</th>
              <th className="p-4 text-right pr-6">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {clients.length === 0 ? (
              <tr><td colSpan="4" className="p-8 text-center text-gray-500 font-medium bg-white">No clients added yet.</td></tr>
            ) : clients.map(client => (
              <tr key={client._id} className="hover:bg-gray-50/50 transition-colors bg-white">
                <td className="p-4 pl-6 font-medium text-gray-900">{client.name}</td>
                <td className="p-4 text-gray-500">
                  <div className="block">{client.email}</div>
                  <div className="text-sm">{client.phone}</div>
                </td>
                <td className="p-4 text-gray-500 text-sm">{client.address}</td>
                <td className="p-4 pr-6 text-right">
                  <button onClick={() => apiAction.deleteClient(client._id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
