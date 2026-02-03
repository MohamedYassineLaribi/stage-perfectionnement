import React, { createContext, useState, useContext } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light'); // 'light', 'dark'

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    };

    const darkMode = theme === 'dark';

    // Apply theme class to body for global CSS usage
    React.useEffect(() => {
        if (darkMode) {
            document.body.classList.add('dark-layout');
        } else {
            document.body.classList.remove('dark-layout');
        }
    }, [darkMode]);

    return (
        <ThemeContext.Provider value={{ theme, darkMode, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
