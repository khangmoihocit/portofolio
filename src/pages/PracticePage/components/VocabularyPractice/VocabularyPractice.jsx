import React, { useState, useMemo, useEffect } from 'react';
import { FaCheckCircle, FaTimesCircle, FaArrowLeft, FaArrowRight, FaTrophy, FaKeyboard } from 'react-icons/fa';
import Button from '../../../../components/common/Button';
import KeyboardGuide from './KeyboardGuide';

const VocabularyPractice = ({ vocabulary, onComplete }) => {
    const [vocabState, setVocabState] = useState(() => 
        vocabulary.map((vocab, index) => ({
            ...vocab,
            id: index,
            nextReview: Date.now(),
            reviewCount: 0,
            isMemorized: false
        }))
    );
    
    const [currentIndex, setCurrentIndex] = useState(0);
    const [userInput, setUserInput] = useState('');
    const [feedback, setFeedback] = useState(null);
    const [showGuide, setShowGuide] = useState(false);

    const vocabToReview = useMemo(() => {
        const now = Date.now();
        return vocabState
            .filter(v => !v.isMemorized && v.nextReview <= now)
            .sort((a, b) => a.nextReview - b.nextReview);
    }, [vocabState]);

    const currentVocab = vocabToReview[currentIndex];

    const isCompleted = vocabState.every(v => v.isMemorized);

    const handleCheck = () => {
        if (!userInput.trim()) return;
        
        const correctAnswer = currentVocab.word.toLowerCase().trim();
        const userAnswer = userInput.toLowerCase().trim();
        const isCorrect = correctAnswer === userAnswer;

        setFeedback({
            isCorrect,
            correctAnswer: currentVocab.word
        });
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && userInput.trim()) {
            if (!feedback) {
                handleCheck();
            } else if (feedback && !feedback.isCorrect) {
                const correctAnswer = currentVocab.word.toLowerCase().trim();
                const userAnswer = userInput.toLowerCase().trim();
                const isCorrect = correctAnswer === userAnswer;

                setFeedback({
                    isCorrect,
                    correctAnswer: currentVocab.word
                });
            }
        }
    };

    // Xử lý keyboard shortcuts
    useEffect(() => {
        const handleGlobalKeyPress = (e) => {
            if (feedback && !e.ctrlKey) {
                if (e.key === '1') {
                    e.preventDefault();
                    setReviewTime(1);
                } else if (e.key === '2') {
                    e.preventDefault();
                    setReviewTime(5);
                } else if (e.key === '3') {
                    e.preventDefault();
                    setReviewTime(10);
                } else if (e.key === '4') {
                    e.preventDefault();
                    setReviewTime(Infinity);
                }
            }

            if (e.ctrlKey && (e.key === ',' || e.key === '<')) {
                e.preventDefault();
                handlePrevious();
            }

            if (e.ctrlKey && (e.key === '.' || e.key === '>')) {
                e.preventDefault();
                handleNext();
            }
        };

        window.addEventListener('keydown', handleGlobalKeyPress);
        return () => window.removeEventListener('keydown', handleGlobalKeyPress);
    }, [feedback, currentIndex, vocabToReview.length]);

    const setReviewTime = (minutes) => {
        const newState = [...vocabState];
        const vocabIndex = vocabState.findIndex(v => v.id === currentVocab.id);
        
        if (vocabIndex !== -1) {
            newState[vocabIndex] = {
                ...newState[vocabIndex],
                nextReview: Date.now() + (minutes * 60 * 1000),
                reviewCount: newState[vocabIndex].reviewCount + 1,
                isMemorized: minutes === Infinity // Infinity = Đã nhớ
            };
            setVocabState(newState);
        }

        setFeedback(null);
        setUserInput('');
        
        if (currentIndex < vocabToReview.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            setCurrentIndex(0);
        }
    };

    const handleNext = () => {
        if (currentIndex < vocabToReview.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setFeedback(null);
            setUserInput('');
        }
    };

    const handlePrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
            setFeedback(null);
            setUserInput('');
        }
    };

    const stats = useMemo(() => {
        const memorized = vocabState.filter(v => v.isMemorized).length;
        const total = vocabState.length;
        const percentage = Math.round((memorized / total) * 100);
        return { memorized, total, percentage };
    }, [vocabState]);

    if (isCompleted) {
        return (
            <div className="vocab-practice-complete">
                <div className="complete-icon">
                    <FaTrophy />
                </div>
                <h2>🎉 Xuất sắc!</h2>
                <p>Bạn đã học thuộc tất cả {vocabState.length} từ vựng trong bài này!</p>
                <div className="complete-stats">
                    <div className="stat-item">
                        <span className="stat-number">{vocabState.length}</span>
                        <span className="stat-label">Từ đã nhớ</span>
                    </div>
                </div>
                <Button onClick={onComplete}>
                    <FaArrowLeft /> Quay lại màn hình trước
                </Button>
            </div>
        );
    }

    if (vocabToReview.length === 0) {
        return (
            <div className="vocab-practice-waiting">
                <h3>Đang chờ ôn tập</h3>
                <p>Bạn đã ôn tất cả từ. Hãy chờ đến thời gian ôn lại hoặc đánh dấu "Đã nhớ" để hoàn thành!</p>
                <div className="waiting-stats">
                    <p>Tiến độ: {stats.memorized} / {stats.total} từ đã nhớ ({stats.percentage}%)</p>
                </div>
                <Button onClick={onComplete}>
                    <FaArrowLeft /> Quay lại
                </Button>
            </div>
        );
    }

    return (
        <div className="vocab-practice">
            {/* Header với thống kê */}
            <div className="practice-header">
                <div className="progress-info">
                    <span className="current-position">
                        Từ {currentIndex + 1} / {vocabToReview.length}
                    </span>
                    <span className="memorized-count">
                        Đã nhớ: {stats.memorized} / {stats.total}
                    </span>
                </div>
                <div className="progress-bar">
                    <div 
                        className="progress-fill" 
                        style={{ width: `${stats.percentage}%` }}
                    />
                </div>
                <button 
                    className="keyboard-guide-toggle"
                    onClick={() => setShowGuide(!showGuide)}
                    title="Xem phím tắt"
                >
                    <FaKeyboard /> Phím tắt
                </button>
            </div>

            {/* Keyboard Guide */}
            {showGuide && <KeyboardGuide onClose={() => setShowGuide(false)} />}

            {/* Card từ vựng */}
            <div className="vocab-card">
                <div className="vocab-meaning-display">
                    <span className="meaning-label">Nghĩa tiếng Việt:</span>
                    <h2 className="meaning-text">{currentVocab.meaning}</h2>
                    <span className="word-type">({currentVocab.type})</span>
                </div>

                {/* Input và button check */}
                <div className="answer-section">
                    <div className="input-group">
                        <input
                            type="text"
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Nhập từ tiếng Anh..."
                            className="vocab-input"
                            autoFocus
                        />
                        <Button 
                            onClick={handleCheck}
                            disabled={!userInput.trim()}
                            className="check-button"
                        >
                            Kiểm tra
                        </Button>
                    </div>

                    {/* Feedback */}
                    {feedback && (
                        <div className={`feedback-box ${feedback.isCorrect ? 'correct' : 'incorrect'}`}>
                            {feedback.isCorrect ? (
                                <>
                                    <FaCheckCircle className="feedback-icon" />
                                    <span className="feedback-text">Chính xác! 🎉</span>
                                </>
                            ) : (
                                <>
                                    <FaTimesCircle className="feedback-icon" />
                                    <span className="feedback-text">
                                        Chưa đúng. Đáp án: <strong>{feedback.correctAnswer}</strong>
                                    </span>
                                </>
                            )}
                        </div>
                    )}
                </div>

                {/* Controls */}
                <div className="vocab-controls">
                    <div className="time-buttons">
                        <button 
                            className="time-btn"
                            onClick={() => setReviewTime(1)}
                            disabled={!feedback}
                        >
                            1 phút
                        </button>
                        <button 
                            className="time-btn"
                            onClick={() => setReviewTime(5)}
                            disabled={!feedback}
                        >
                            5 phút
                        </button>
                        <button 
                            className="time-btn"
                            onClick={() => setReviewTime(10)}
                            disabled={!feedback}
                        >
                            10 phút
                        </button>
                        <button 
                            className="time-btn memorized"
                            onClick={() => setReviewTime(Infinity)}
                            disabled={!feedback}
                        >
                            Đã nhớ
                        </button>
                    </div>

                    <div className="navigation-buttons">
                        <button 
                            className="nav-btn"
                            onClick={handlePrevious}
                            disabled={currentIndex === 0}
                        >
                            <FaArrowLeft />
                        </button>
                        <button 
                            className="nav-btn"
                            onClick={handleNext}
                            disabled={currentIndex === vocabToReview.length - 1}
                        >
                            <FaArrowRight />
                        </button>
                    </div>
                </div>
            </div>

            {/* Hint */}
            <div className="practice-hint">
                💡 Mẹo: Sau khi kiểm tra, chọn thời gian bạn muốn ôn lại từ này. Nhấn Enter để nhập lại nếu sai. Nhấn <FaKeyboard style={{verticalAlign: 'middle'}} /> để xem phím tắt!
            </div>
        </div>
    );
};

export default VocabularyPractice;
