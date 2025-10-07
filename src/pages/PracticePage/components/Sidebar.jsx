import React, { useMemo, useState } from 'react';
import { translationLessons } from '../../../data/translationData.js';
import { FaPencilAlt, FaComments, FaChevronDown, FaChevronRight } from 'react-icons/fa';

const Sidebar = ({ onSelectLesson, onSelectSentenceBuilding, onSelectConversational }) => {
    const [expandedDifficulties, setExpandedDifficulties] = useState({
        'Cơ bản': true,
        'Trung bình': true,
        'Nâng cao': true
    });

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

    const toggleDifficulty = (difficulty) => {
        setExpandedDifficulties(prev => ({
            ...prev,
            [difficulty]: !prev[difficulty]
        }));
    };

    return (
        <aside className="practice-sidebar">
            <h3>Chế độ luyện tập</h3>
            <div className="practice-mode-section">
                <div 
                    className="sentence-building-option" 
                    onClick={onSelectSentenceBuilding}
                >
                    <FaPencilAlt /> Thực hành đặt câu với từ vựng
                </div>
                <div 
                    className="sentence-building-option" 
                    onClick={onSelectConversational}
                    style={{marginTop: '10px'}}
                >
                    <FaComments /> Luyện Viết Câu Đơn
                </div>
            </div>

            <h3>Luyện dịch văn bản</h3>
            {difficultyOrder.map(difficulty => (
                lessonsByDifficulty[difficulty] && (
                    <div key={difficulty} className="difficulty-group">
                        <h4 
                            className="difficulty-header"
                            onClick={() => toggleDifficulty(difficulty)}
                        >
                            <span className="difficulty-icon">
                                {expandedDifficulties[difficulty] ? (
                                    <FaChevronDown />
                                ) : (
                                    <FaChevronRight />
                                )}
                            </span>
                            <span className="difficulty-text">{difficulty}</span>
                            <span className="lesson-count">
                                ({lessonsByDifficulty[difficulty].length})
                            </span>
                        </h4>
                        {expandedDifficulties[difficulty] && (
                            <ul className="lessons-list">
                                {lessonsByDifficulty[difficulty].map(lesson => (
                                    <li key={lesson.id} onClick={() => onSelectLesson(lesson)}>
                                        {lesson.title}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                )
            ))}
        </aside>
    );
};

export default Sidebar;
