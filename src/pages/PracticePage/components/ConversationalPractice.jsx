import React, { useState, useEffect } from 'react';
import SettingsScreen from './ConversationalPractice/SettingsScreen';
import PracticeScreen from './ConversationalPractice/PracticeScreen';

const ConversationalPractice = () => {
    const [currentScreen, setCurrentScreen] = useState('settings'); // 'settings' or 'practice'
    const [practiceSettings, setPracticeSettings] = useState(null);

    const handleStartPractice = (settings) => {
        setPracticeSettings(settings);
        setCurrentScreen('practice');
    };

    const handleBackToSettings = () => {
        setCurrentScreen('settings');
    };

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        const mainArea = document.querySelector('.practice-main-area');
        if (mainArea) {
            mainArea.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [currentScreen]);

    return (
        <>
            {currentScreen === 'settings' ? (
                <SettingsScreen onStartPractice={handleStartPractice} />
            ) : (
                <PracticeScreen 
                    settings={practiceSettings} 
                    onBackToSettings={handleBackToSettings}
                />
            )}
        </>
    );
};

export default ConversationalPractice;