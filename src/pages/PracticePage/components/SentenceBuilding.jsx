import React, { useState } from 'react';
import { FaRobot, FaCheckCircle, FaLightbulb } from 'react-icons/fa';
import { createSentenceExercises, gradeUserAnswer, getExerciseHint } from '../../../services/sentencePracticeService';
import Button from '../../../components/common/Button';

const SentenceBuilding = () => {
    const [vocabInput, setVocabInput] = useState('');
    const [difficulty, setDifficulty] = useState('trung bình');
    const [exercises, setExercises] = useState([]);
    const [userAnswers, setUserAnswers] = useState({});
    const [results, setResults] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [checkingStates, setCheckingStates] = useState({});
    const [hints, setHints] = useState({});
    const [loadingHints, setLoadingHints] = useState({});
    const [showHints, setShowHints] = useState({});
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
        setHints({});
        setShowHints({});

        try {
            const generatedExercises = await createSentenceExercises(vocabList, difficulty);
            setExercises(generatedExercises);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleVocabInputKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleCreateExercises();
        }
    };

    const handleAnswerKeyPress = (event, index) => {
        if (event.key === 'Enter') {
            if (userAnswers[index]) {
                handleCheckAnswer(index);
            }
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
                [index]: { correct: false, feedback: 'Lỗi chấm điểm', suggestion: 'Vui lòng thử lại.' }
            }));
        } finally {
            setCheckingStates(prev => ({ ...prev, [index]: false }));
        }
    };

    const handleGetHint = async (index) => {
        const exercise = exercises[index];
        
        // If hint is already visible, toggle it off
        if (showHints[index]) {
            setShowHints(prev => ({ ...prev, [index]: false }));
            return;
        }

        // If hint doesn't exist yet, fetch it
        if (!hints[index]) {
            setLoadingHints(prev => ({ ...prev, [index]: true }));
            try {
                const hint = await getExerciseHint(exercise.englishWord, exercise.vietnameseSentence);
                setHints(prev => ({ ...prev, [index]: hint }));
            } catch (err) {
                setHints(prev => ({
                    ...prev,
                    [index]: { vocabulary: [], grammar: 'Không thể lấy gợi ý. Vui lòng thử lại.' }
                }));
            } finally {
                setLoadingHints(prev => ({ ...prev, [index]: false }));
            }
        }

        // Show the hint
        setShowHints(prev => ({ ...prev, [index]: true }));
    };

    return (
        <div className="sentence-practice-container">
            <h2>Thực hành đặt câu tiếng Anh với AI <FaRobot /></h2>
            <p className="description">
                Nhập các từ vựng bạn muốn luyện tập, AI sẽ tạo câu tiếng Việt và bạn hãy dịch sang tiếng Anh.
            </p>

            <div className="input-section">
                <div className="select-wrapper">
                    <label htmlFor="difficulty-select">Độ khó:</label>
                    <select
                        id="difficulty-select"
                        value={difficulty}
                        onChange={(e) => setDifficulty(e.target.value)}
                        disabled={isLoading}
                        aria-label="Chọn độ khó"
                    >
                        <option value="cơ bản">Cơ bản</option>
                        <option value="trung bình">Trung bình</option>
                        <option value="nâng cao">Nâng cao</option>
                    </select>
                </div>
                <input
                    type="text"
                    value={vocabInput}
                    onChange={(e) => setVocabInput(e.target.value)}
                    placeholder="Nhập từ vựng, cách nhau bởi dấu phẩy (ví dụ: apple, book, run)..."
                    disabled={isLoading}
                    onKeyPress={handleVocabInputKeyPress}
                />
                <Button onClick={handleCreateExercises} disabled={isLoading}>
                    {isLoading ? 'Đang tạo...' : 'Tạo bài tập'}
                </Button>
            </div>
            
            {error && <p className="error-text">{error}</p>}

            {exercises.length > 0 && (
                <div className="exercise-list">
                    <h3>Bài tập của bạn ({exercises.length} câu)</h3>
                    {exercises.map((ex, index) => {
                        const result = results[index];
                        const hint = hints[index];
                        return (
                            <div key={index} className="exercise-item">
                                <div className="exercise-number">Câu {index + 1}</div>
                                <div className="vietnamese-sentence-wrapper">
                                    <p className="vietnamese-sentence">
                                        <strong>Câu tiếng Việt:</strong> {ex.vietnameseSentence}
                                    </p>
                                    <button
                                        className="hint-button"
                                        onClick={() => handleGetHint(index)}
                                        disabled={loadingHints[index]}
                                        title="Xem gợi ý"
                                    >
                                        <FaLightbulb />
                                    </button>
                                </div>
                                {showHints[index] && hint && (
                                    <div className="hint-section">
                                        <div className="hint-content">
                                            <strong>💡 Gợi ý từ AI:</strong>
                                            {Array.isArray(hint.vocabulary) && hint.vocabulary.length > 0 && (
                                                <div className="hint-vocabulary">
                                                    <strong style={{ color: 'var(--color-green)' }}>Từ vựng: </strong>
                                                    <span className="vocabulary-inline" >
                                                        {hint.vocabulary.map(({ word, meaning }, idx) => (
                                                            <span key={`${word}-${idx}`} className="vocab-item" style={{display:'flex', gap: '0 6px'}}>
                                                                <strong style={{ color: 'var(--color-green)' }}>{word}</strong>: {meaning}
                                                            </span>
                                                        ))}
                                                    </span>
                                                </div>
                                            )}
                                            {hint.grammar && (
                                                <p className="hint-grammar">
                                                     <i>{hint.grammar}</i>
                                                </p>
                                            )}
                                            {(!Array.isArray(hint.vocabulary) || hint.vocabulary.length === 0) && !hint.grammar && (
                                                <p className="hint-empty">Chưa có gợi ý phù hợp cho câu này.</p>
                                            )}
                                        </div>
                                    </div>
                                )}
                                <p className="keyword">
                                    <strong>Từ khóa:</strong> <span className="highlight">{ex.englishWord}</span>
                                </p>
                                <div className="answer-section">
                                    <input
                                        type="text"
                                        placeholder="Nhập câu trả lời tiếng Anh của bạn..."
                                        value={userAnswers[index] || ''}
                                        onChange={(e) => handleAnswerChange(index, e.target.value)}
                                        onKeyPress={(e) => handleAnswerKeyPress(e, index)}
                                    />
                                    <Button
                                        onClick={() => handleCheckAnswer(index)}
                                        disabled={!userAnswers[index] || checkingStates[index]}
                                    >
                                        {checkingStates[index] ? 'Đang chấm...' : 'Kiểm tra'}
                                    </Button>
                                    {result?.correct && (
                                        <FaCheckCircle className="correct-icon" title="Chính xác!" />
                                    )}
                                </div>
                                {result && (
                                    <div className={`feedback-section ${result.correct ? 'correct' : 'incorrect'}`}>
                                        {result.correct ? (
                                            <>
                                                <p className="feedback-text success">
                                                    <strong>✓ Chính xác!</strong> {result.feedback}
                                                </p>
                                                {result.explanation && (
                                                    <p className="explanation-text">
                                                        <strong>Giải thích:</strong> {result.explanation}
                                                    </p>
                                                )}
                                            </>
                                        ) : (
                                            <>
                                                <p className="feedback-text">
                                                    <strong>Nhận xét:</strong> {result.feedback}
                                                </p>
                                                <p className="suggestion-text">
                                                    <strong>Gợi ý:</strong> {result.suggestion}
                                                </p>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default SentenceBuilding;
