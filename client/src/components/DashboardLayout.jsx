import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, FileText, PlusCircle, LogOut, Moon, Sun } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function DashboardLayout({ children }) {
  const { logout, user, theme, toggleTheme, currency, updateCurrency } = useAppContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menu = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/dashboard' },
    { name: 'Clients', icon: <Users size={20} />, path: '/clients' },
    { name: 'Invoices', icon: <FileText size={20} />, path: '/invoices' },
    { name: 'New Invoice', icon: <PlusCircle size={20} />, path: '/invoices/new' },
  ];

  const currencies = [
    { symbol: '₹', code: 'INR', label: 'Rupee' },
    { symbol: '$', code: 'USD', label: 'USD' },
    { symbol: '€', code: 'EUR', label: 'Euro' },
    { symbol: '£', code: 'GBP', label: 'Pound' }
  ];

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Sidebar */}
      <aside className="w-64 flex flex-col pt-6 glass-card shadow-sm m-4 rounded-2xl h-[calc(100vh-2rem)] overflow-hidden shrink-0">
        <div className="px-6 pb-6 border-b border-gray-100 dark:border-gray-700">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Nexus Invoice</h1>
          <p className="text-xs text-gray-500 mt-1 uppercase tracking-wide font-medium">{user?.companyName || 'Workspace'}</p>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {menu.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-primary/10 text-primary font-bold' 
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100 font-medium'
                }`
              }
            >
              {item.icon}
              {item.name}
            </NavLink>
          ))}
        </nav>
        
        <div className="p-4 mt-auto border-t border-gray-100 dark:border-gray-700 space-y-3">
          {/* Settings / Toggles */}
          <div className="flex items-center justify-between px-2 mb-4">
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <select 
              value={currency.code}
              onChange={(e) => {
                const sel = currencies.find(c => c.code === e.target.value);
                if (sel) updateCurrency(sel);
              }}
              className="px-2 py-1 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md text-gray-700 dark:text-gray-300 outline-none focus:ring-1 focus:ring-primary"
            >
              {currencies.map(c => (
                <option key={c.code} value={c.code}>{c.symbol} {c.code}</option>
              ))}
            </select>
          </div>

          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-left text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors duration-200"
          >
            <LogOut size={20} />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        {children}
      </main>
    </div>
  );
}
