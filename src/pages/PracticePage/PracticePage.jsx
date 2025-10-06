import React, { useState, useMemo } from 'react';
import { FaBook, FaExchangeAlt, FaArrowLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom';

import { translationLessons } from '../../data/translationData.js';
import { evaluateTranslation } from '../../services/practiceService.js';
import Button from '../../components/common/Button.jsx';

// --- COMPONENTS CON ---

const Sidebar = ({ onSelectLesson }) => {
    const lessonsByDifficulty = useMemo(() => {
        return translationLessons.reduce((acc, lesson) => {
            const { difficulty } = lesson;
            if (!acc[difficulty]) {
                acc[difficulty] = [];
            }
            acc[difficulty].push(lesson);
            return acc;
        }, {});
    }, []);

    const difficultyOrder = ['Cơ bản', 'Trung bình', 'Nâng cao'];

    return (
        <aside className="practice-sidebar">
            <h3>Danh sách bài học</h3>
            {difficultyOrder.map(difficulty => (
                lessonsByDifficulty[difficulty] && (
                    <div key={difficulty} className="difficulty-group">
                        <h4>{difficulty}</h4>
                        <ul>
                            {lessonsByDifficulty[difficulty].map(lesson => (
                                <li key={lesson.id} onClick={() => onSelectLesson(lesson)}>
                                    {lesson.title}
                                </li>
                            ))}
                        </ul>
                    </div>
                )
            ))}
        </aside>
    );
};

const VocabularyStep = ({ lesson, onStartPractice }) => {
    return (
        <div className="practice-step vocab-step">
            <h2>Học Từ Vựng: {lesson.title}</h2>
            <p>Hãy làm quen với các từ mới sẽ xuất hiện trong bài dịch nhé.</p>
            <div className="vocab-list">
                {lesson.vocabulary.map((vocab, index) => (
                    <div className="vocab-item" key={index}>
                        <div className="vocab-word"><strong>{vocab.word}</strong> <em>({vocab.type})</em></div>
                        <div className="vocab-meaning">{vocab.meaning}</div>
                    </div>
                ))}
            </div>
            <Button onClick={onStartPractice}>
                <FaExchangeAlt /> Bắt đầu luyện dịch
            </Button>
        </div>
    );
};

const TranslationStep = ({ lesson, direction }) => {
    const [userTranslation, setUserTranslation] = useState('');
    const [aiFeedback, setAiFeedback] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const isEngToViet = direction === 'en-vi';
    const originalText = isEngToViet ? lesson.englishText : lesson.vietnameseText;
    const sourceLang = isEngToViet ? 'Tiếng Anh' : 'Tiếng Việt';
    const targetLang = isEngToViet ? 'Tiếng Việt' : 'Tiếng Anh';

    const handleCheckTranslation = async () => {
        if (!userTranslation.trim()) return;
        setIsLoading(true);
        setAiFeedback(null);
        try {
            const feedback = await evaluateTranslation(originalText, userTranslation, sourceLang, targetLang);
            setAiFeedback(feedback);
        } catch (error) {
            setAiFeedback({
                score: 'Lỗi',
                overallFeedback: 'Đã có lỗi xảy ra khi chấm điểm. Vui lòng thử lại.',
                corrections: []
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="practice-step translation-step">
            <h2>
                Luyện dịch {sourceLang} - {targetLang}: {lesson.title}
            </h2>
            <div className="translation-workspace">
                <div className="original-text-panel">
                    <h4>Đoạn văn gốc ({sourceLang})</h4>
                    <p>{originalText}</p>
                </div>
                <div className="translation-panel">
                    <h4>Bản dịch của bạn ({targetLang})</h4>
                    <textarea
                        value={userTranslation}
                        onChange={(e) => setUserTranslation(e.target.value)}
                        placeholder={`Nhập bản dịch của bạn vào đây...`}
                        disabled={isLoading}
                    />
                    <Button onClick={handleCheckTranslation} disabled={isLoading}>
                        {isLoading ? 'AI Đang Chấm...' : 'Kiểm Tra Với AI'}
                    </Button>
                </div>
            </div>
            {aiFeedback && (
                <div className="feedback-panel">
                    <h3>Nhận xét từ AI</h3>
                    <div className="feedback-summary">
                        <div className="feedback-score">
                            <span>Điểm</span>
                            <strong>{aiFeedback.score}/10</strong>
                        </div>
                        <p className="feedback-overall">{aiFeedback.overallFeedback}</p>
                    </div>
                    {aiFeedback.corrections && aiFeedback.corrections.length > 0 && (
                        <div className="feedback-corrections">
                            <h4>Gợi ý sửa lỗi:</h4>
                            {aiFeedback.corrections.map((item, index) => (
                                <div className="correction-item" key={index}>
                                    <p><strong>Lỗi:</strong> <span className="error-text">"{item.original}"</span></p>
                                    <p><strong>Sửa thành:</strong> <span className="suggestion-text">"{item.suggestion}"</span></p>
                                    <p><strong>Giải thích:</strong> {item.explanation}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};


// --- TRANG CHÍNH ---

const PracticePage = () => {
    const [selectedLesson, setSelectedLesson] = useState(null);
    const [currentStep, setCurrentStep] = useState('select'); // 'select', 'vocab', 'practice'
    const [practiceDirection, setPracticeDirection] = useState('en-vi'); // 'en-vi' or 'vi-en'

    const handleSelectLesson = (lesson) => {
        setSelectedLesson(lesson);
        setCurrentStep('vocab');
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

        return (
            <div className="welcome-screen">
                <FaBook />
                <h2>Chào mừng đến với trang Luyện Dịch</h2>
                <p>Vui lòng chọn một bài học từ danh sách bên phải để bắt đầu.</p>
            </div>
        );
    };

    return (
        <div className="practice-page-container">
            <Link to="/" className="home-link">
                <FaArrowLeft /> Về trang chủ
            </Link>
            <div className="practice-layout">
                <div className="practice-main-area">
                    {renderContent()}
                </div>
                <Sidebar onSelectLesson={handleSelectLesson} />
            </div>
        </div>
    );
};

export default PracticePage;

