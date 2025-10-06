import React, { useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom';

import Button from '../../components/common/Button.jsx';
import { 
    Sidebar, 
    VocabularyStep, 
    TranslationStep, 
    WelcomeScreen,
    SentenceBuilding
} from './components';
import MenuLanguage from '../../components/common/MenuLanguage/MenuLanguage.jsx';
import Theme from '../../components/common/Theme/Theme.jsx';

const PracticePage = () => {
    const [selectedLesson, setSelectedLesson] = useState(null);
    const [currentStep, setCurrentStep] = useState('select'); // 'select', 'vocab', 'practice', 'sentence-building'
    const [practiceDirection, setPracticeDirection] = useState('en-vi'); // 'en-vi' or 'vi-en'

    const handleSelectLesson = (lesson) => {
        setSelectedLesson(lesson);
        setCurrentStep('vocab');
    };

    const handleSelectSentenceBuilding = () => {
        setSelectedLesson(null);
        setCurrentStep('sentence-building');
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

    const renderContent = () => {
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
                    />
                     <div className="practice-options">
                        <h3>Chọn chế độ luyện tập:</h3>
                        <Button onClick={() => handleStartPractice('en-vi')}>Dịch Anh - Việt</Button>
                        <Button onClick={() => handleStartPractice('vi-en')}>Dịch Việt - Anh</Button>
                    </div>
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
                    <Link to="/" className="home-link">
                        <FaArrowLeft /> Về trang chủ
                    </Link>
                <div className="header-actions">
                    <MenuLanguage />
                    <Theme />
                </div>
            </div>
            <div className="practice-layout">
                <div className="practice-main-area">
                    {renderContent()}
                </div>
                <Sidebar 
                    onSelectLesson={handleSelectLesson}
                    onSelectSentenceBuilding={handleSelectSentenceBuilding}
                />
            </div>
        </div>
    );
};

export default PracticePage;

