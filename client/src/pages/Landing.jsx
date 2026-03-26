import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex flex-col font-sans">
      <nav className="flex items-center justify-between p-6 px-10 glass sticky top-0 z-50">
        <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
          Nexus Invoicing
        </div>
        <div className="space-x-4">
          <Link to="/auth" className="text-gray-600 hover:text-primary font-medium px-4">Log in</Link>
          <Link to="/auth" className="btn-primary py-2.5 px-6 shadow-lg shadow-indigo-200">Get Started</Link>
        </div>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 max-w-5xl mx-auto py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8 max-w-3xl"
        >

          
          <h1 className="text-6xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-indigo-800 to-gray-900 leading-tight">
            Create Professional Invoices in Seconds
          </h1>
          
          <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
            The minimal, powerful invoicing platform designed for creators, freelancers, and businesses who value beautiful design.
          </p>

          <div className="flex items-center justify-center gap-4 pt-4">
            <Link to="/auth" className="btn-primary text-lg h-14 flex items-center gap-2 px-8 shadow-xl shadow-indigo-200">
              Start Building <ArrowRight size={20} />
            </Link>
          </div>

          <div className="flex items-center justify-center gap-8 pt-12 text-gray-500 font-medium">
            <span className="flex items-center gap-2"><CheckCircle2 className="text-green-500" size={20} /> Professional PDFs</span>
            <span className="flex items-center gap-2"><CheckCircle2 className="text-green-500" size={20} /> Client Management</span>
            <span className="flex items-center gap-2"><CheckCircle2 className="text-green-500" size={20} /> Free Forever</span>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
