import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Package, Truck, Search, ArrowRight } from 'lucide-react';
import RainbowShield from '../components/RainbowShield';
import FloatingLines from '../components/FloatingLines';
import './DashboardLayout.css';

const DashboardLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const getTitle = (pathname) => {
        if (pathname.includes('dashboard')) return 'Consumer Dashboard';
        if (pathname.includes('risks')) return 'Risk Assessment';
        if (pathname.includes('agents')) return 'AI Agent Intelligence';
        if (pathname.includes('chat')) return 'AI Assistant';
        return 'Dashboard';
    };

    const navLinks = [
        { label: 'Home', path: '/', icon: Home },
        { label: 'Manufacturer', path: '/manufacturer-login', icon: Package },
        { label: 'Distributor', path: '/distributor-login', icon: Truck },
        { label: 'Verify Product', path: '/verify', icon: Search },
    ];

    return (
        <div className="dashboard-layout">
            {/* Background */}
            <div className="absolute inset-0 z-0">
                <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                    <FloatingLines 
                        enabledWaves={["top","middle","bottom"]}
                        linesGradient={["#ff5f6d","#ffc371","#ffd166","#38b6ff","#7c4dff","#ff66c4"]}
                        lineCount={5}
                        lineDistance={5}
                        bendRadius={5}
                        bendStrength={-0.5}
                        interactive={true}
                        parallax={true}
                    />
                </div>
            </div>

            {/* Overlay Blur */}
            <div className="absolute inset-0 backdrop-blur-md bg-black/20 z-0"></div>

            {/* Header Navbar */}
            <header className="fixed top-0 left-0 right-0 z-40 border-b border-slate-800/50 backdrop-blur-xl">
                <div className="container mx-auto px-10 py-4 flex items-center justify-between">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-3"
                    >
                        <RainbowShield size={32} />
                        <div>
                            <h1 className="text-xl font-bold font-display text-white">
                                SUPPLY CHAIN
                            </h1>
                            <p className="text-xs font-mono">INTEGRITY TRACKER</p>
                        </div>
                    </motion.div>

                    <motion.nav
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-4"
                    >
                        {navLinks.map((link) => {
                            const isActive = location.pathname === link.path || location.pathname.startsWith(link.path);
                            const Icon = link.icon;
                            return (
                                <button
                                    key={link.path}
                                    onClick={() => navigate(link.path)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                                        isActive
                                            ? 'bg-cyan-500/20 text-white border border-cyan-400/50'
                                            : 'text-slate-400 hover:text-white border border-slate-700/50 hover:border-slate-600'
                                    }`}
                                >
                                    <Icon size={16} />
                                    <span>{link.label}</span>
                                </button>
                            );
                        })}
                    </motion.nav>
                </div>
            </header>

            <div className="main-content-wrapper relative z-10">
                <main className="content-area">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
