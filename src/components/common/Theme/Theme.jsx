import React, { useState, useEffect } from 'react';
import { FaSun, FaMoon } from 'react-icons/fa';
import styles from './styles.module.scss';

const Theme = () => {
    const [isDarkMode, setIsDarkMode] = useState(false);

    // Load theme from localStorage on component mount
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (savedTheme) {
            setIsDarkMode(savedTheme === 'dark');
        } else {
            // Default to light mode
            setIsDarkMode(false);
        }
    }, []);

    // Apply theme to document when state changes
    useEffect(() => {
        const root = document.documentElement;
        if (isDarkMode) {
            root.classList.add('dark-theme');
            localStorage.setItem('theme', 'dark');
        } else {
            root.classList.remove('dark-theme');
            localStorage.setItem('theme', 'light');
        }
    }, [isDarkMode]);

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
    };

    const { themeToggle, toggleButton, icon, sun, moon, stars, clouds } = styles;

    return (
        <div 
            className={`${themeToggle} ${isDarkMode ? styles.dark : ''}`}
            onClick={toggleTheme}
            role="button"
            tabIndex={0}
            aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleTheme();
                }
            }}
        >
            <div className={stars}></div>
            <div className={clouds}></div>
            <div className={toggleButton}>
                <FaSun className={`${icon} ${sun}`} />
                <FaMoon className={`${icon} ${moon}`} />
            </div>
        </div>
    );
};

export default Theme;