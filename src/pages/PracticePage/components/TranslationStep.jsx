import React, { useState } from 'react';
import { evaluateTranslation } from '../../../services/practiceService.js';
import Button from '../../../components/common/Button.jsx';

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

export default TranslationStep;
