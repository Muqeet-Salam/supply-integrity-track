import React from 'react';
import { NavLink } from 'react-router-dom';
import { Shield, Home, Users, Package, Truck, Search } from 'lucide-react';

const Sidebar = () => {
  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-cyber-500/20 text-white' : 'text-slate-400 hover:text-white'}`;

  return (
    <aside className="w-64 min-w-[240px] bg-dark-100 border-r border-slate-800/50 p-6 hidden md:block">
      <div className="flex items-center gap-3 mb-8">
        <Shield className="text-cyber-500" size={28} />
        <div>
          <h3 className="text-lg font-bold">Supply Chain</h3>
          <p className="text-xs text-slate-500">Integrity Tracker</p>
        </div>
      </div>

      <nav className="space-y-2">
        <NavLink to="/" className={linkClass}>
          <Home size={16} />
          <span>Home</span>
        </NavLink>

        <NavLink to="/role-selection" className={linkClass}>
          <Users size={16} />
          <span>Role Selection</span>
        </NavLink>

        <NavLink to="/consumer-dashboard" className={linkClass}>
          <Shield size={16} />
          <span>Consumer</span>
        </NavLink>

        <NavLink to="/manufacturer-login" className={linkClass}>
          <Package size={16} />
          <span>Manufacturer</span>
        </NavLink>

        <NavLink to="/distributor-login" className={linkClass}>
          <Truck size={16} />
          <span>Distributor</span>
        </NavLink>

        <NavLink to="/verify" className={linkClass}>
          <Search size={16} />
          <span>Verify Product</span>
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
