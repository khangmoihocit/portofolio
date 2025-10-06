import React, { useState } from 'react';
import { FaRobot, FaCheckCircle } from 'react-icons/fa';
import { createSentenceExercises, gradeUserAnswer } from '../../../services/sentencePracticeService';
import Button from '../../common/Button';
import '../../../styles/components/_sentencePractice.scss';

const SentencePractice = () => {
    const [vocabInput, setVocabInput] = useState('');
    const [exercises, setExercises] = useState([]);
    const [userAnswers, setUserAnswers] = useState({});
    const [results, setResults] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [checkingStates, setCheckingStates] = useState({});
    const [error, setError] = useState('');

    const handleCreateExercises = async () => {
        const vocabList = vocabInput.split(',').map(v => v.trim()).filter(Boolean);
        if (vocabList.length === 0) {
            setError('Vui lòng nhập ít nhất một từ vựng.');
            return;
        }

        setIsLoading(true);
        setError('');
        setExercises([]);
        setUserAnswers({});
        setResults({});

        try {
            const generatedExercises = await createSentenceExercises(vocabList);
            setExercises(generatedExercises);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAnswerChange = (index, value) => {
        setUserAnswers(prev => ({ ...prev, [index]: value }));
    };

    const handleCheckAnswer = async (index) => {
        const exercise = exercises[index];
        const userAnswer = userAnswers[index] || '';

        if (!userAnswer) return;

        setCheckingStates(prev => ({ ...prev, [index]: true }));
        try {
            const result = await gradeUserAnswer(exercise.englishWord, exercise.vietnameseSentence, userAnswer);
            setResults(prev => ({ ...prev, [index]: result }));
        } catch (err) {
            setResults(prev => ({
                ...prev,
                [index]: { correct: false, suggestion: 'Lỗi chấm điểm, vui lòng thử lại.' }
            }));
        } finally {
            setCheckingStates(prev => ({ ...prev, [index]: false }));
        }
    };

    return (
        <div className="sentence-practice-container">
            <h4>Thực hành đặt câu tiếng Anh với AI <FaRobot /></h4>

            <div className="input-section">
                <input
                    type="text"
                    value={vocabInput}
                    onChange={(e) => setVocabInput(e.target.value)}
                    placeholder="Nhập từ vựng, cách nhau bởi dấu phẩy..."
                    disabled={isLoading}
                />
                <Button onClick={handleCreateExercises} disabled={isLoading}>
                    {isLoading ? 'Đang tạo...' : 'Tạo bài tập'}
                </Button>
            </div>
            {error && <p className="error-text">{error}</p>}

            <div className="exercise-list">
                {exercises.map((ex, index) => (
                    <div key={index} className="exercise-item">
                        <p className="vietnamese-sentence">
                            <strong>Câu tiếng Việt:</strong> {ex.vietnameseSentence} (Từ khóa: <strong>{ex.englishWord}</strong>)
                        </p>
                        <div className="answer-section">
                            <input
                                type="text"
                                placeholder="Nhập câu trả lời của bạn..."
                                value={userAnswers[index] || ''}
                                onChange={(e) => handleAnswerChange(index, e.target.value)}
                                disabled={!!results[index]}
                            />
                            <Button
                                onClick={() => handleCheckAnswer(index)}
                                disabled={!userAnswers[index] || !!results[index] || checkingStates[index]}
                            >
                                {checkingStates[index] ? 'Đang chấm...' : 'Kiểm tra'}
                            </Button>
                            {results[index]?.correct && (
                                <FaCheckCircle className="correct-icon" />
                            )}
                        </div>
                        {results[index] && !results[index].correct && (
                            <p className="suggestion-text">{results[index].suggestion}</p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SentencePractice;