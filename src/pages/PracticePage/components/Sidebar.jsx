import React, { useMemo } from 'react';
import { FaPencilAlt } from 'react-icons/fa';
import { translationLessons } from '../../../data/translationData.js';

const Sidebar = ({ onSelectLesson, onSelectSentenceBuilding }) => {
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
            <h3>Chế độ luyện tập</h3>
            <div className="practice-mode-section">
                <div 
                    className="sentence-building-option" 
                    onClick={onSelectSentenceBuilding}
                >
                    <FaPencilAlt /> Luyện đặt câu với AI
                </div>
            </div>

            <h3>Luyện dịch</h3>
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

export default Sidebar;
