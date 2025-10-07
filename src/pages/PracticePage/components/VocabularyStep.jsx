import React from 'react';
import { FaExchangeAlt, FaBookOpen } from 'react-icons/fa';
import Button from '../../../components/common/Button.jsx';

const VocabularyStep = ({ lesson, onStartPractice, onStartVocabPractice }) => {
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
            <div className="vocab-actions">
                <Button onClick={onStartVocabPractice}>
                    <FaBookOpen /> Học từ vựng
                </Button>
                <Button onClick={onStartPractice}>
                    <FaExchangeAlt /> Bắt đầu luyện dịch
                </Button>
            </div>
        </div>
    );
};

export default VocabularyStep;
