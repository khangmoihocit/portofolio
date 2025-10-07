import React, { useState } from 'react';
import { FaCheckCircle, FaLightbulb, FaSpinner } from 'react-icons/fa';
import { gradeConversationalTranslation, getConversationalHint } from '../../../../services/conversationalAIService';
import Button from '../../../../components/common/Button';

const parseMarkdownBold = (text) => {
    if (!text) return text;
    
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**')) {
            const content = part.slice(2, -2);
            return <strong key={index} className="markdown-bold">{content}</strong>;
        }
        return part;
    });
};

const SentenceCard = ({ sentence, index, total }) => {
    const [userInput, setUserInput] = useState('');
    const [feedback, setFeedback] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showHint, setShowHint] = useState(false);
    const [hint, setHint] = useState(null);
    const [hintError, setHintError] = useState(null);
    const [isHintLoading, setIsHintLoading] = useState(false);

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

    const toggleHint = async () => {
        const nextShowHint = !showHint;
        setShowHint(nextShowHint);

        if (nextShowHint && !hint && !isHintLoading) {
            setIsHintLoading(true);
            setHintError(null);
            try {
                const aiHint = await getConversationalHint(sentence.vietnamese);
                setHint(aiHint);
            } catch (error) {
                setHintError(error.message || 'Không thể tải gợi ý.');
            } finally {
                setIsHintLoading(false);
            }
        }
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

            {showHint && (
                <div className="hint-section">
                    <div className="hint-content">
                        <strong>💡 Gợi ý từ AI:</strong>
                        {isHintLoading && (
                            <p className="hint-loading">
                                <FaSpinner /> Đang lấy gợi ý...
                            </p>
                        )}
                        {hintError && !isHintLoading && (
                            <p className="hint-error">{hintError}</p>
                        )}
                        {hint && !isHintLoading && !hintError && (
                            <>
                                {Array.isArray(hint.vocabulary) && hint.vocabulary.length > 0 && (
                                    <div className="hint-vocabulary">
                                        <strong>� Từ vựng:</strong>
                                        <ul>
                                            {hint.vocabulary.map(({ word, meaning }, idx) => (
                                                <li key={`${word}-${idx}`} style={{display:'flex', gap: '0 6px'}}>
                                                    <strong>{word}</strong>: {meaning}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                {hint.grammar && (
                                    <p className="hint-grammar" style={{display:'flex', gap: '0 6px', fontSize:'16px'}}>
                                        <i>{parseMarkdownBold(hint.grammar)}</i>
                                    </p>
                                )}
                                {(!Array.isArray(hint.vocabulary) || hint.vocabulary.length === 0) && !hint.grammar && (
                                    <p className="hint-empty">Chưa có gợi ý phù hợp cho câu này.</p>
                                )}
                            </>
                        )}
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
                                <strong>✓ Chính xác!</strong> {parseMarkdownBold(feedback.feedback)}
                            </p>
                            {feedback.grammar && (
                                <p className="grammar-explanation">
                                    <strong>📚 Ngữ pháp:</strong> {parseMarkdownBold(feedback.grammar)}
                                </p>
                            )}
                            {feedback.suggestion && (
                                <p className="alternative-suggestion">
                                    <strong>💬 Cách khác:</strong> {parseMarkdownBold(feedback.suggestion)}
                                </p>
                            )}
                        </>
                    ) : (
                        <>
                            <p className="feedback-text">
                                <strong>Nhận xét:</strong> {parseMarkdownBold(feedback.feedback)}
                            </p>
                            {feedback.grammar && (
                                <p className="grammar-explanation">
                                    <strong>📚 Ngữ pháp cần dùng:</strong> {parseMarkdownBold(feedback.grammar)}
                                </p>
                            )}
                            <p className="suggestion-text">
                                <strong>✏️ Câu đúng:</strong> {parseMarkdownBold(feedback.suggestion)}
                            </p>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default SentenceCard;
