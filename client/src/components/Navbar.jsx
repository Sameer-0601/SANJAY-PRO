import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { LayoutDashboard, Users, FileText, LogOut, FilePlus } from 'lucide-react';

const Navbar = () => {
  const { logout } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="h-full w-full bg-white/70 backdrop-blur-md border-r border-border p-8 flex flex-col">
      <div className="flex items-center gap-3 mb-10">
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary/20">I</div>
        <span className="font-bold text-xl tracking-tight text-slate-800">Invoicer</span>
      </div>

      <div className="flex-1 flex flex-col gap-2">
        <NavLink to="/" icon={<LayoutDashboard size={18} />} label="Dashboard" active={location.pathname === '/'} />
        <NavLink to="/invoices" icon={<FileText size={18} />} label="Invoices" active={location.pathname === '/invoices'} />
        <NavLink to="/clients" icon={<Users size={18} />} label="Clients" active={location.pathname === '/clients'} />
        <NavLink to="/builder" icon={<FilePlus size={18} />} label="Create Invoice" active={location.pathname === '/builder'} />
      </div>

      <button 
        onClick={handleLogout}
        className="mt-auto flex items-center gap-3 p-4 rounded-xl text-sm font-bold text-slate-400 hover:text-danger hover:bg-danger/5 transition-all border border-transparent hover:border-danger/10"
      >
        <LogOut size={18} />
        Logout Session
      </button>
    </nav>
  );
};

const NavLink = ({ to, icon, label, active }) => (
  <Link 
    to={to} 
    className={`nav-link ${active ? 'active' : ''}`}
  >
    {icon}
    {label}
  </Link>
);

export default Navbar;
