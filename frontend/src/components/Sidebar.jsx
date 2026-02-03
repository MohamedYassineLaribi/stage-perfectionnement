import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import * as Icon from 'feather-icons-react'
import { useTheme } from '../contexts/ThemeContext'
import { useAuth } from '../contexts/AuthContext'

const Sidebar = ({ collapsed, mobileOpen, onToggle, onMobileClose }) => {
    const location = useLocation()
    const { darkMode } = useTheme()
    const { user } = useAuth()
    const [openMenus, setOpenMenus] = useState({})

    const toggleSubmenu = (menu) => {
        setOpenMenus(prev => ({
            ...prev,
            [menu]: !prev[menu]
        }))
    }

    const isActive = (path) => location.pathname === path

    const navCategories = [
        {
            title: 'DASHBOARD',
            items: [{ icon: 'Grid', label: 'Tableau de Bord', path: '/' }]
        },
        {
            title: 'GESTION COMMERCIALE',
            items: [
                { icon: 'FileText', label: 'Offres', path: '/offers' },
                { icon: 'Briefcase', label: 'Propositions', path: '/proposals' },
                { icon: 'ShoppingCart', label: 'Commandes', path: '/orders' },
                { icon: 'DollarSign', label: 'Factures', path: '/invoices' },
                { icon: 'Package', label: 'Articles', path: '/articles' }
            ]
        },
        {
            title: 'RELATION CLIENT',
            items: [
                { icon: 'Users', label: 'Clients', path: '/customers' },
                { icon: 'UserPlus', label: 'Contacts', path: '/contacts' },
                { icon: 'Target', label: 'Leads', path: '/leads' },
                { icon: 'Activity', label: 'Activités', path: '/activities' },
                { icon: 'Calendar', label: 'Calendrier', path: '/calendar' }
            ]
        },
        {
            title: 'RAPPORT & ANALYSE',
            items: [
                { icon: 'PieChart', label: 'Analytiques', path: '/analytics' },
                { icon: 'BarChart2', label: 'Rapports', path: '/reports' }
            ]
        },
        {
            title: 'ADMINISTRATION',
            adminOnly: true,
            items: [
                { icon: 'UserCheck', label: 'Utilisateurs', path: '/users' },
                { icon: 'Shield', label: 'Rôle & Droits', path: '/roles' },
                { icon: 'Key', label: 'Permissions', path: '/permissions' }
            ]
        },
        {
            title: 'CONFIGURATION CRM',
            adminOnly: true,
            items: [
                { icon: 'Activity', label: "Types d'Activités", path: '/typeactivities' },
                { icon: 'FileText', label: 'Workflow & Statuts', path: '/statuses' },
                { icon: 'Zap', label: 'Automatisation', path: '/automations' },
                { icon: 'Tag', label: "Types d'Offres", path: '/typeoffers' }
            ]
        },
        {
            title: 'SYSTÈME',
            items: [
                { icon: 'Settings', label: 'Paramètres', path: '/settings' }
            ]
        }
    ];

    const getRoleName = (r) => {
        if (!r) return 'Admin';
        if (typeof r === 'string') return r;
        if (typeof r === 'object' && r.name) return r.name;
        return 'Admin';
    };

    const userRole = getRoleName(user?.role).toLowerCase();
    const isAdmin = userRole === 'admin' || userRole === 'administrateur';
    const isCommercial = userRole === 'commercial' || userRole === 'vendeur';

    const IconComponent = ({ name }) => {
        const Component = Icon[name]
        return Component ? <Component size={20} className="sidebar-icon" /> : <Icon.Circle size={20} className="sidebar-icon" />
    }

    return (
        <>
            {/* Overlay for mobile */}
            {mobileOpen && (
                <div
                    className="nxl-overlay"
                    onClick={onMobileClose}
                    style={{ background: 'rgba(0,0,0,0.2)', backdropFilter: 'blur(2px)' }}
                />
            )}

            <nav
                className={`nxl-navigation ${collapsed ? 'nxl-navigation-mini' : ''} ${mobileOpen ? 'nxl-navigation-open' : ''}`}
                style={{
                    borderRight: '1px solid rgba(0,0,0,0.05)',
                    background: '#fff',
                    width: collapsed ? '80px' : '280px',
                    height: '100vh',
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    zIndex: 1050,
                    transition: 'all 0.3s ease',
                    boxShadow: '4px 0 24px 0 rgba(0,0,0,0.02)'
                }}
            >
                <div
                    className="navbar-wrapper"
                    style={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    <div className="m-header d-flex justify-content-center align-items-center py-4">
                        <Link to="/" className="b-brand d-flex align-items-center gap-2 text-decoration-none">
                            <img src="/crm-logo.png" alt="CRM App Logo" style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
                            {!collapsed && <span className="fw-bolder fs-4 text-dark tracking-wide">CRM App</span>}
                        </Link>
                    </div>

                    <div className="navbar-content scrollbar-hidden flex-grow-1 px-3 py-2" style={{ overflowY: 'auto' }}>
                        <ul className="nxl-navbar list-unstyled">
                            {navCategories.map((cat, catIdx) => {
                                // Filter category based on adminOnly flag
                                if (cat.adminOnly && !isAdmin) return null;

                                // Commercial role specific restrictions (Explicit hide)
                                if (isCommercial) {
                                    const hiddenCategories = ['RAPPORT & ANALYSE'];
                                    if (hiddenCategories.includes(cat.title)) return null;
                                }

                                return (
                                    <li key={catIdx} className="mb-4">
                                        {!collapsed && (
                                            <div className="text-uppercase text-muted fw-bold fs-10 mb-2 px-3" style={{ fontSize: '0.65rem', letterSpacing: '1.2px', opacity: 0.7 }}>
                                                {cat.title}
                                            </div>
                                        )}
                                        <ul className="list-unstyled">
                                            {cat.items.map((item, itemIdx) => {
                                                // Filter item based on adminOnly flag
                                                if (item.adminOnly && !isAdmin) return null;

                                                return (
                                                    <li key={itemIdx} className="mb-1">
                                                        <Link
                                                            to={item.path}
                                                            className={`d-flex align-items-center py-2 px-3 rounded-3 text-decoration-none transition-all ${isActive(item.path)
                                                                ? 'bg-primary text-white shadow-md'
                                                                : 'text-secondary hover-bg-light'
                                                                }`}
                                                            style={{
                                                                transition: 'all 0.2s ease',
                                                                background: isActive(item.path) ? 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)' : 'transparent',
                                                                boxShadow: isActive(item.path) ? '0 4px 12px rgba(99, 102, 241, 0.3)' : 'none',
                                                                fontSize: '0.9rem'
                                                            }}
                                                            onClick={onMobileClose}
                                                        >
                                                            <span className="nxl-micon me-3 d-flex align-items-center">
                                                                <IconComponent name={item.icon} />
                                                            </span>
                                                            {!collapsed && <span className="nxl-mtext fw-medium">{item.label}</span>}
                                                        </Link>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>

                </div>
            </nav>
        </>
    )
}

export default Sidebar
