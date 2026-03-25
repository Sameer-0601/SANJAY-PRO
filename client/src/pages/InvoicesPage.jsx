import React from 'react';
import { motion } from 'framer-motion';
import { Download, Trash2 } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { Link } from 'react-router-dom';
import generatePDF from '../utils/pdfGenerator';

function Plus({size}) { return <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg> }

export default function InvoicesPage() {
  const { invoices, user, apiAction, currency } = useAppContext();

  const handleStatusChange = async (id, status) => {
    await apiAction.updateInvoice(id, { status });
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Invoices</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">View, track, and manage your billing history.</p>
        </div>
        <Link to="/invoices/new" className="btn-primary flex items-center gap-2 shadow-sm">
          <Plus size={18} /> Create Invoice
        </Link>
      </div>

      <div className="glass-card overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-700 text-gray-500 dark:text-gray-400 text-sm font-semibold uppercase tracking-wider">
              <th className="p-4 pl-6">Invoice details</th>
              <th className="p-4 hidden sm:table-cell">Client</th>
              <th className="p-4">Amount</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right pr-6">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700 text-gray-900 dark:text-gray-100">
            {invoices.length === 0 ? (
              <tr><td colSpan="5" className="p-8 text-center text-gray-500 font-medium">No invoices created yet. Start billing!</td></tr>
            ) : invoices.map(inv => (
              <tr key={inv._id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors">
                <td className="p-4 pl-6">
                  <div className="font-bold">#{inv.invoiceNumber}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{new Date(inv.date).toLocaleDateString()}</div>
                </td>
                <td className="p-4 font-medium text-gray-700 dark:text-gray-300 hidden sm:table-cell">{inv.clientId?.name || 'Unknown'}</td>
                <td className="p-4 font-bold">{currency.symbol}{inv.total.toFixed(2)}</td>
                <td className="p-4">
                  <select 
                    value={inv.status} 
                    onChange={(e) => handleStatusChange(inv._id, e.target.value)}
                    className={`text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wide cursor-pointer outline-none border-none focus:ring-2 focus:ring-primary/20 ${
                      inv.status === 'Paid' ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400' :
                      inv.status === 'Pending' ? 'bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400' : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <option value="Draft">Draft</option>
                    <option value="Pending">Pending</option>
                    <option value="Paid">Paid</option>
                  </select>
                </td>
                <td className="p-4 pr-6 flex justify-end gap-2 text-right">
                  <button onClick={() => generatePDF(inv, user, currency)} className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors" title="Download PDF">
                    <Download size={18} />
                  </button>
                  <button onClick={() => apiAction.deleteInvoice(inv._id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors" title="Delete">
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
