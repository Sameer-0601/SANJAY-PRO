import React from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Clock, CheckCircle, FileText } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function Dashboard() {
  const { invoices = [], clients = [], currency } = useAppContext();

  const totalRevenue = invoices.filter(inv => inv.status === 'Paid').reduce((acc, curr) => acc + curr.total, 0);
  const pendingAmount = invoices.filter(inv => inv.status === 'Pending').reduce((acc, curr) => acc + curr.total, 0);
  
  const stats = [
    { title: 'Total Revenue', amount: `${currency.symbol}${totalRevenue.toFixed(2)}`, icon: <DollarSign className="text-green-500" size={24} />, color: 'bg-green-50 dark:bg-green-500/10' },
    { title: 'Pending Payments', amount: `${currency.symbol}${pendingAmount.toFixed(2)}`, icon: <Clock className="text-orange-500 dark:text-orange-400" size={24} />, color: 'bg-orange-50 dark:bg-orange-500/10' },
    { title: 'Total Invoices', amount: invoices.length, icon: <FileText className="text-primary" size={24} />, color: 'bg-blue-50 dark:bg-blue-500/10' },
    { title: 'Total Clients', amount: clients.length, icon: <CheckCircle className="text-purple-500" size={24} />, color: 'bg-purple-50 dark:bg-purple-500/10' }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Overview</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Here's what's happening with your business today.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-6 flex flex-col justify-between hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{stat.title}</span>
              <div className={`p-3 rounded-xl flex items-center justify-center ${stat.color}`}>
                {stat.icon}
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">{stat.amount}</div>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 glass-card p-8 min-h-[400px]">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 font-sans">Recent Activity</h3>
        {invoices.length > 0 ? (
          <div className="space-y-4">
            {invoices.slice(0, 5).map(inv => (
              <div key={inv._id} className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">{inv.clientId?.name || 'Unknown Client'}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Invoice #{inv.invoiceNumber} • {new Date(inv.date).toLocaleDateString()}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-gray-900 dark:text-white">{currency.symbol}{inv.total.toFixed(2)}</div>
                  <div className={`text-xs font-semibold px-2 py-1 rounded-full uppercase tracking-wide inline-block mt-1 ${
                    inv.status === 'Paid' ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400' :
                    inv.status === 'Pending' ? 'bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400' : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                  }`}>
                    {inv.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
           <div className="text-gray-400 text-center py-20 flex flex-col items-center gap-4">
              <FileText size={48} className="opacity-20" />
              No recent activity detected. Create your first invoice!
           </div>
        )}
      </div>
    </div>
  );
}
