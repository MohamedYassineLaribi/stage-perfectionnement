import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { useTheme } from '../contexts/ThemeContext';

const MainLayout = () => {
    const [collapsed, setCollapsed] = React.useState(false);
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const { darkMode } = useTheme();

    const toggleSidebar = () => setCollapsed(!collapsed);
    const toggleMobileMenu = () => setMobileOpen(!mobileOpen);

    return (
        <div className={`nxl-container ${darkMode ? 'dark-layout' : ''}`}>
            <Sidebar
                collapsed={collapsed}
                mobileOpen={mobileOpen}
                onToggle={toggleSidebar}
                onMobileClose={() => setMobileOpen(false)}
            />

            <div style={{
                marginLeft: window.innerWidth < 992 ? '0' : (collapsed ? '80px' : '280px'),
                transition: 'margin-left 0.3s ease',
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                flex: '1 1 auto', /* Take remaining space */
                width: 'auto',
                overflow: 'hidden'
            }}>
                <Header
                    onMenuClick={toggleMobileMenu}
                    onToggleSidebar={toggleSidebar}
                    sidebarCollapsed={collapsed}
                />

                <main
                    className="nxl-main"
                    style={{
                        marginTop: '80px', /* Push down below Header */
                        paddingTop: '30px', /* Visual gap inside */
                        paddingRight: '30px',
                        paddingBottom: '30px',
                        paddingLeft: '30px', /* Restore left padding for breathing room */
                        margin: '0',
                        minHeight: 'calc(100vh - 80px)',
                        width: '100%',
                        boxSizing: 'border-box'
                    }}
                >
                    <div className="main-content" style={{ width: '100%' }}>
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
