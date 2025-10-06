import React, { createContext, useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import LogoVN from '../assets/svgs/vn.svg';
import LogoENG from '../assets/svgs/eng.svg';
import LogoJP from '../assets/svgs/japan.svg';

const LanguageContext = createContext();

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};

export const languages = [
    { 
        code: 'vi', 
        name: 'Vietnamese', 
        nativeName: 'Tiếng Việt',
        fullName: 'Vietnamese (vi-VN)',
        flag: LogoVN,
        shortCode: 'VN'
    },
    { 
        code: 'en', 
        name: 'English', 
        nativeName: 'English',
        fullName: 'English (en-US)',
        flag: LogoENG,
        shortCode: 'ENG'
    },
    { 
        code: 'ja', 
        name: 'Japanese', 
        nativeName: '日本語',
        fullName: 'Japanese (ja-JP)',
        flag: LogoJP,
        shortCode: 'JP'
    }
];

export const LanguageProvider = ({ children }) => {
    const { i18n } = useTranslation();
    const [currentLanguage, setCurrentLanguage] = useState(() => {
        const savedLang = localStorage.getItem('language');
        return savedLang || i18n.language || 'en';
    });

    useEffect(() => {
        if (currentLanguage !== i18n.language) {
            i18n.changeLanguage(currentLanguage);
        }
    }, [currentLanguage, i18n]);

    useEffect(() => {
        localStorage.setItem('language', currentLanguage);
    }, [currentLanguage]);

    const changeLanguage = (langCode) => {
        if (languages.find(lang => lang.code === langCode)) {
            setCurrentLanguage(langCode);
            i18n.changeLanguage(langCode);
        }
    };

    const getCurrentLanguageData = () => {
        return languages.find(lang => lang.code === currentLanguage) || languages[1]; // Default to English
    };

    const value = {
        currentLanguage,
        changeLanguage,
        languages,
        currentLanguageData: getCurrentLanguageData(),
        t: i18n.t
    };

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
};

export default LanguageContext;
