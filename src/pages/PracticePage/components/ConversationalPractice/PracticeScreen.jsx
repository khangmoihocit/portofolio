import React, { useMemo, useState, useEffect } from 'react'; 
import { FaComments, FaCog, FaHistory } from 'react-icons/fa';
import { conversationalSentences } from '../../../../data/conversationalData';
import Button from '../../../../components/common/Button';
import SentenceCard from './SentenceCard';

const STORAGE_KEY = 'conversational_practice_history';

const PracticeScreen = ({ settings, onBackToSettings }) => {
    const [completedIds, setCompletedIds] = useState(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.error("Lỗi đọc localStorage:", error);
            return [];
        }
    });

    const handleSentenceComplete = (id) => {
        if (!completedIds.includes(id)) {
            const newCompletedIds = [...completedIds, id];
            setCompletedIds(newCompletedIds);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newCompletedIds));
        }
    };

    const filteredSentences = useMemo(() => {
        return conversationalSentences.filter(s => {
            const difficultyMatch = settings.difficulty === 'all' || s.difficulty === settings.difficulty;
            const categoryMatch = settings.category === 'all' || s.category === settings.category;
            return difficultyMatch && categoryMatch;
        });
    }, [settings]);

    const completedCountInFilter = filteredSentences.filter(s => completedIds.includes(s.id)).length;

    return (
        <div className="conversational-practice">
            <div className="practice-header-bar">
                <div className="header-info">
                    <h2>
                        <FaComments /> Luyện Viết Câu Đơn
                    </h2>
                    <div className="filter-info">
                        <span className="filter-tag">Độ khó: {settings.difficulty === 'all' ? 'Tất cả' : settings.difficulty}</span>
                        <span className="filter-tag">Chủ đề: {settings.category === 'all' ? 'Tất cả' : settings.category}</span>
                        <span className="filter-tag" style={{ color: 'var(--color-green)', fontWeight: 'bold' }}>
                           <FaHistory /> Đã xong: {completedCountInFilter}/{filteredSentences.length}
                        </span>
                    </div>
                </div>
                <Button onClick={onBackToSettings} className="settings-button">
                    <FaCog /> Cài đặt
                </Button>
            </div>

            <p className="page-description">
                Thực hành viết câu đơn tiếng Anh từ câu tiếng Việt và nhận phản hồi từ AI.
            </p>

            {filteredSentences.length === 0 ? (
                <div className="no-sentences">
                    <p>Không có câu nào phù hợp với lựa chọn của bạn.</p>
                    <Button onClick={onBackToSettings}>Thay đổi cài đặt</Button>
                </div>
            ) : (
                <div className="sentences-list">
                    {filteredSentences.map((sentence, index) => (
                        <SentenceCard 
                            key={sentence.id} 
                            sentence={sentence}
                            index={index + 1}
                            total={filteredSentences.length}
                            isCompleted={completedIds.includes(sentence.id)}
                            onComplete={() => handleSentenceComplete(sentence.id)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default PracticeScreen;