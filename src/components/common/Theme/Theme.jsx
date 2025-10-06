import React from 'react';
import { FaSun, FaMoon } from 'react-icons/fa';
import { useTheme } from '../../../contexts';
import styles from './styles.module.scss';

const Theme = () => {
    const { isDarkMode, toggleTheme } = useTheme();

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