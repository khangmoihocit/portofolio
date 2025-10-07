import React, { useState } from 'react';
import { FaCheckCircle, FaLightbulb } from 'react-icons/fa';
import { gradeConversationalTranslation } from '../../../../services/conversationalAIService';
import Button from '../../../../components/common/Button';

const SentenceCard = ({ sentence, index, total }) => {
    const [userInput, setUserInput] = useState('');
    const [feedback, setFeedback] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showHint, setShowHint] = useState(false);

    const handleCheck = async () => {
        if (!userInput.trim()) return;
        setIsLoading(true);
        setFeedback(null);
        try {
            const result = await gradeConversationalTranslation(sentence.vietnamese, userInput);
            setFeedback(result);
        } catch (error) {
            setFeedback({ correct: false, feedback: 'Lỗi', suggestion: error.message });
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !isLoading && userInput.trim()) {
            handleCheck();
        }
    };

    const toggleHint = () => {
        setShowHint(prev => !prev);
    };

    return (
        <div className="conversation-item">
            <div className="item-header">
                <span className="item-number">Câu {index} / {total}</span>
                <span className={`difficulty-badge ${sentence.difficulty.toLowerCase().replace(' ', '-')}`}>
                    {sentence.difficulty}
                </span>
                <span className="category-badge">{sentence.category}</span>
            </div>
            
            <div className="vietnamese-sentence-wrapper">
                <p className="vietnamese-text">{sentence.vietnamese}</p>
                <button
                    className="hint-button"
                    onClick={toggleHint}
                    title="Xem gợi ý"
                >
                    <FaLightbulb />
                </button>
            </div>

            {showHint && sentence.suggestion && (
                <div className="hint-section">
                    <div className="hint-content">
                        <strong>💡 Gợi ý cấu trúc:</strong>
                        <p>{sentence.suggestion}</p>
                    </div>
                </div>
            )}
            
            <div className="answer-wrapper">
                <input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Nhập câu tiếng Anh của bạn..."
                    disabled={isLoading}
                />
                <Button onClick={handleCheck} disabled={isLoading || !userInput.trim()}>
                    {isLoading ? 'Đang kiểm tra...' : 'Kiểm tra'}
                </Button>
                {feedback?.correct && (
                    <FaCheckCircle className="correct-icon" title="Chính xác!" />
                )}
            </div>
            
            {feedback && (
                <div className={`feedback-bubble ${feedback.correct ? 'correct' : 'incorrect'}`}>
                    {feedback.correct ? (
                        <>
                            <p className="success-message">
                                <strong>✓ Chính xác!</strong> {feedback.feedback}
                            </p>
                            {feedback.grammar && (
                                <p className="grammar-explanation">
                                    <strong>📚 Ngữ pháp:</strong> {feedback.grammar}
                                </p>
                            )}
                            {feedback.suggestion && (
                                <p className="alternative-suggestion">
                                    <strong>💬 Cách khác:</strong> {feedback.suggestion}
                                </p>
                            )}
                        </>
                    ) : (
                        <>
                            <p className="feedback-text">
                                <strong>Nhận xét:</strong> {feedback.feedback}
                            </p>
                            {feedback.grammar && (
                                <p className="grammar-explanation">
                                    <strong>📚 Ngữ pháp cần dùng:</strong> {feedback.grammar}
                                </p>
                            )}
                            <p className="suggestion-text">
                                <strong>✏️ Câu đúng:</strong> {feedback.suggestion}
                            </p>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default SentenceCard;
