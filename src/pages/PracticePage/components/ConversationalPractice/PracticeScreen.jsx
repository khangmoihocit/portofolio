import React, { useMemo } from 'react';
import { FaComments, FaCog } from 'react-icons/fa';
import { conversationalSentences } from '../../../../data/conversationalData';
import Button from '../../../../components/common/Button';
import SentenceCard from './SentenceCard';

const PracticeScreen = ({ settings, onBackToSettings }) => {
    const filteredSentences = useMemo(() => {
        return conversationalSentences.filter(s => {
            const difficultyMatch = settings.difficulty === 'all' || s.difficulty === settings.difficulty;
            const categoryMatch = settings.category === 'all' || s.category === settings.category;
            return difficultyMatch && categoryMatch;
        });
    }, [settings]);

    return (
        <div className="conversational-practice">
            <div className="practice-header-bar">
                <div className="header-info">
                    <h2>
                        <FaComments /> Luyện Giao Tiếp
                    </h2>
                    <div className="filter-info">
                        <span className="filter-tag">Độ khó: {settings.difficulty === 'all' ? 'Tất cả' : settings.difficulty}</span>
                        <span className="filter-tag">Chủ đề: {settings.category === 'all' ? 'Tất cả' : settings.category}</span>
                    </div>
                </div>
                <Button onClick={onBackToSettings} className="settings-button">
                    <FaCog /> Cài đặt
                </Button>
            </div>

            <p className="page-description">
                Thực hành dịch các mẫu câu giao tiếp thông dụng từ Tiếng Việt sang Tiếng Anh và nhận phản hồi từ AI.
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
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default PracticeScreen;
