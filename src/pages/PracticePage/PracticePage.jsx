import React, { useState } from 'react';
import { FaArrowLeft, FaBars, FaTimes } from 'react-icons/fa';
import { Link } from 'react-router-dom';

import Button from '../../components/common/Button.jsx';
import { 
    Sidebar, 
    VocabularyStep, 
    TranslationStep, 
    WelcomeScreen,
    SentenceBuilding,
    ConversationalPractice 
} from './components';
import VocabularyPractice from './components/VocabularyPractice/VocabularyPractice.jsx';
import MenuLanguage from '../../components/common/MenuLanguage/MenuLanguage.jsx';
import Theme from '../../components/common/Theme/Theme.jsx';

const PracticePage = () => {
    const [selectedLesson, setSelectedLesson] = useState(null);
    const [currentStep, setCurrentStep] = useState('select'); // 'select', 'vocab', 'practice', 'sentence-building', 'vocab-practice'
    const [practiceDirection, setPracticeDirection] = useState('en-vi'); // 'en-vi' or 'vi-en'
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const closeSidebar = () => {
        setIsSidebarOpen(false);
    };

    const handleSelectLesson = (lesson) => {
        setSelectedLesson(lesson);
        setCurrentStep('vocab');
        closeSidebar();
    };

    const handleSelectSentenceBuilding = () => {
        setSelectedLesson(null);
        setCurrentStep('sentence-building');
        closeSidebar();
    };
    
    const handleStartPractice = (direction) => {
        setPracticeDirection(direction);
        setCurrentStep('practice');
    };

    const handleBackToSelection = () => {
        setSelectedLesson(null);
        setCurrentStep('select');
    };
    
    const handleBackToVocab = () => {
        setCurrentStep('vocab');
    };

    const handleStartVocabPractice = () => {
        setCurrentStep('vocab-practice');
    };

    const handleCompleteVocabPractice = () => {
        setCurrentStep('vocab');
    };

    const handleSelectConversational = () => {
        setSelectedLesson(null);
        setCurrentStep('conversational');
        closeSidebar();
    };

    const renderContent = () => {
        if (currentStep === 'conversational') {
            return (
                <div className="practice-main-content">
                    <button onClick={handleBackToSelection} className="back-button">
                        <FaArrowLeft /> Quay lại
                    </button>
                    <ConversationalPractice />
                </div>
            );
        }

        if (currentStep === 'sentence-building') {
            return (
                <div className="practice-main-content">
                    <button onClick={handleBackToSelection} className="back-button">
                        <FaArrowLeft /> Quay lại
                    </button>
                    <SentenceBuilding />
                </div>
            );
        }

        if (currentStep === 'vocab' && selectedLesson) {
            return (
                <div className="practice-main-content">
                    <button onClick={handleBackToSelection} className="back-button"><FaArrowLeft /> Quay lại</button>
                    <VocabularyStep 
                        lesson={selectedLesson}
                        onStartPractice={() => handleStartPractice('en-vi')} // Mặc định bắt đầu với Anh-Việt
                        onStartVocabPractice={handleStartVocabPractice}
                    />
                     <div className="practice-options">
                        <h3>Chọn chế độ luyện tập:</h3>
                        <Button onClick={() => handleStartPractice('en-vi')}>Dịch Anh - Việt</Button>
                        <Button onClick={() => handleStartPractice('vi-en')}>Dịch Việt - Anh</Button>
                    </div>
                </div>
            );
        }

        if (currentStep === 'vocab-practice' && selectedLesson) {
            return (
                <div className="practice-main-content">
                    <button onClick={handleCompleteVocabPractice} className="back-button"><FaArrowLeft /> Quay lại từ vựng</button>
                    <VocabularyPractice 
                        vocabulary={selectedLesson.vocabulary}
                        onComplete={handleCompleteVocabPractice}
                    />
                </div>
            );
        }
        if (currentStep === 'practice' && selectedLesson) {
            return (
                 <div className="practice-main-content">
                    <button onClick={handleBackToVocab} className="back-button"><FaArrowLeft /> Quay lại học từ vựng</button>
                    <TranslationStep lesson={selectedLesson} direction={practiceDirection} />
                 </div>
            );
        }

        return <WelcomeScreen />;
    };

    return (
        <div className="practice-page-container">
            <div className="practice-header">
                <div className="header-left">
                    <button 
                        className="hamburger-menu" 
                        onClick={toggleSidebar}
                        aria-label="Toggle sidebar"
                    >
                        {isSidebarOpen ? <FaTimes /> : <FaBars />}
                    </button>
                    <Link to="/" className="home-link">
                        <FaArrowLeft /> Về trang chủ
                    </Link>
                </div>
                <div className="header-actions">
                    {/* <MenuLanguage /> */}
                    <Theme />
                </div>
            </div>
            
            {isSidebarOpen && (
                <div 
                    className="sidebar-overlay" 
                    onClick={closeSidebar}
                    aria-hidden="true"
                />
            )}
            
            <div className="practice-layout">
                <div className="practice-main-area">
                    {renderContent()}
                </div>
                <div className={`practice-sidebar-wrapper ${isSidebarOpen ? 'open' : ''}`}>
                    <Sidebar 
                        onSelectLesson={handleSelectLesson}
                        onSelectSentenceBuilding={handleSelectSentenceBuilding}
                        onSelectConversational={handleSelectConversational}
                    />
                </div>
            </div>
        </div>
    );
};

export default PracticePage;

