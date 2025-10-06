import React, { useState, useMemo } from 'react';
import { FaComments, FaCheckCircle } from 'react-icons/fa';
import { conversationalSentences } from '../../../data/conversationalData';
import { gradeConversationalTranslation } from '../../../services/conversationalAIService';
import Button from '../../../components/common/Button';

const SentenceCard = ({ sentence }) => {
    const [userInput, setUserInput] = useState('');
    const [feedback, setFeedback] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

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
        if (e.key === 'Enter' && !isLoading) {
            handleCheck();
        }
    }

    return (
        <div className="conversation-item">
            <p className="vietnamese-text">{sentence.vietnamese}</p>
            <div className="answer-wrapper">
                <input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Dịch câu trên sang tiếng Anh..."
                    disabled={isLoading}
                />
                <Button onClick={handleCheck} disabled={isLoading}>
                    {isLoading ? 'Checking...' : 'Check'}
                </Button>
            </div>
            {feedback && (
                <div className={`feedback-bubble ${feedback.correct ? 'correct' : 'incorrect'}`}>
                    <p><strong>{feedback.feedback}</strong></p>
                    <p>{feedback.suggestion}</p>
                </div>
            )}
        </div>
    );
};


const ConversationalPractice = () => {
    const sentencesByCategory = useMemo(() => {
        return conversationalSentences.reduce((acc, sentence) => {
            const { category } = sentence;
            if (!acc[category]) {
                acc[category] = [];
            }
            acc[category].push(sentence);
            return acc;
        }, {});
    }, []);

    return (
        <div className="conversational-practice">
            <h2>
                <FaComments /> Luyện Giao Tiếp
            </h2>
            <p className="page-description">
                Thực hành dịch các mẫu câu giao tiếp thông dụng từ Tiếng Việt sang Tiếng Anh và nhận phản hồi từ AI.
            </p>

            {Object.entries(sentencesByCategory).map(([category, sentences]) => (
                <div key={category} className="category-section">
                    <h3 className="category-title">{category}</h3>
                    <div className="sentences-list">
                        {sentences.map(sentence => (
                            <SentenceCard key={sentence.id} sentence={sentence} />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ConversationalPractice;