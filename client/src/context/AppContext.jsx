import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AppContext = createContext();
const BASE_URL = "https://your-backend.onrender.com";
const API_URL = `${BASE_URL}/api`;

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [clients, setClients] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Settings
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [currency, setCurrency] = useState(
    JSON.parse(localStorage.getItem('currency')) || { symbol: '₹', code: 'INR', label: 'Rupee' }
  );

  useEffect(() => {
    // Apply theme
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  const updateCurrency = (newCurrency) => {
    setCurrency(newCurrency);
    localStorage.setItem('currency', JSON.stringify(newCurrency));
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['x-auth-token'] = token;
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async () => {
    try {
      const res = await axios.get(`${API_URL}/auth/user`);
      setUser(res.data);
      await fetchInitialData();
    } catch (error) {
      logout();
    } finally {
      setLoading(false);
    }
  };

  const fetchInitialData = async () => {
    try {
      const [clientsRes, invoicesRes] = await Promise.all([
        axios.get(`${API_URL}/clients`),
        axios.get(`${API_URL}/invoices`)
      ]);
      setClients(clientsRes.data);
      setInvoices(invoicesRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const login = async (credentials, isRegister = false) => {
    const endpoint = isRegister ? 'register' : 'login';
    const res = await axios.post(`${API_URL}/auth/${endpoint}`, credentials);
    localStorage.setItem('token', res.data.token);
    axios.defaults.headers.common['x-auth-token'] = res.data.token;
    setUser(res.data.user);
    await fetchInitialData();
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['x-auth-token'];
    setUser(null);
    setClients([]);
    setInvoices([]);
  };

  const apiAction = {
    addClient: async (data) => {
      const res = await axios.post(`${API_URL}/clients`, data);
      setClients([res.data, ...clients]);
    },
    deleteClient: async (id) => {
      await axios.delete(`${API_URL}/clients/${id}`);
      setClients(clients.filter(c => c._id !== id));
    },
    addInvoice: async (data) => {
      const res = await axios.post(`${API_URL}/invoices`, data);
      setInvoices([res.data, ...invoices]);
      return res.data;
    },
    updateInvoice: async (id, data) => {
      const res = await axios.put(`${API_URL}/invoices/${id}`, data);
      setInvoices(invoices.map(inv => inv._id === id ? res.data : inv));
      return res.data;
    },
    deleteInvoice: async (id) => {
      await axios.delete(`${API_URL}/invoices/${id}`);
      setInvoices(invoices.filter(inv => inv._id !== id));
    }
  };

  return (
    <AppContext.Provider value={{
      user, clients, invoices, loading, login, logout, fetchInitialData, apiAction,
      theme, toggleTheme, currency, updateCurrency
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
