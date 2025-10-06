import React, { useState, useMemo } from 'react';
import { FaPlay, FaCog } from 'react-icons/fa';
import { conversationalSentences } from '../../../../data/conversationalData';
import Button from '../../../../components/common/Button';

const SettingsScreen = ({ onStartPractice }) => {
    const [selectedDifficulty, setSelectedDifficulty] = useState('all');
    const [selectedCategory, setSelectedCategory] = useState('all');

    // Lấy danh sách độ khó và chủ đề duy nhất
    const difficulties = useMemo(() => {
        const uniqueDifficulties = [...new Set(conversationalSentences.map(s => s.difficulty))];
        return ['all', ...uniqueDifficulties];
    }, []);

    const categories = useMemo(() => {
        const uniqueCategories = [...new Set(conversationalSentences.map(s => s.category))];
        return ['all', ...uniqueCategories];
    }, []);

    // Đếm số câu sẽ được luyện tập
    const sentenceCount = useMemo(() => {
        return conversationalSentences.filter(s => {
            const difficultyMatch = selectedDifficulty === 'all' || s.difficulty === selectedDifficulty;
            const categoryMatch = selectedCategory === 'all' || s.category === selectedCategory;
            return difficultyMatch && categoryMatch;
        }).length;
    }, [selectedDifficulty, selectedCategory]);

    const handleStart = () => {
        if (sentenceCount > 0) {
            onStartPractice({
                difficulty: selectedDifficulty,
                category: selectedCategory
            });
        }
    };

    const difficultyLabels = {
        'all': 'Tất cả',
        'Cơ bản': 'Cơ bản',
        'Trung bình': 'Trung bình',
        'Nâng cao': 'Nâng cao'
    };

    const categoryLabels = {
        'all': 'Tất cả chủ đề'
    };

    return (
        <div className="conversational-settings">
            <div className="settings-header">
                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px'}}>
                    <FaCog className="settings-icon" style={{ fontSize: '2rem'}} />
                    <h2>Cài đặt luyện tập</h2>
                </div>
                <p>Chọn độ khó và chủ đề bạn muốn luyện tập</p>
            </div>

            <div className="settings-content">
                {/* Chọn độ khó */}
                <div className="setting-group">
                    <label className="setting-label">
                        <span className="label-text">Độ khó</span>
                        <span className="label-description">Chọn mức độ phù hợp với trình độ của bạn</span>
                    </label>
                    <div className="options-grid">
                        {difficulties.map(diff => (
                            <button
                                key={diff}
                                className={`option-card ${selectedDifficulty === diff ? 'selected' : ''}`}
                                onClick={() => setSelectedDifficulty(diff)}
                            >
                                <span className="option-text">
                                    {difficultyLabels[diff] || diff}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Chọn chủ đề */}
                <div className="setting-group">
                    <label className="setting-label">
                        <span className="label-text">Chủ đề</span>
                        <span className="label-description">Chọn chủ đề giao tiếp bạn muốn luyện</span>
                    </label>
                    <div className="options-grid">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                className={`option-card ${selectedCategory === cat ? 'selected' : ''}`}
                                onClick={() => setSelectedCategory(cat)}
                            >
                                <span className="option-text">
                                    {categoryLabels[cat] || cat}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Thông tin số câu */}
                <div className="sentence-count-info">
                    <span className="count-label">Số câu sẽ luyện:</span>
                    <span className="count-number">{sentenceCount}</span>
                    <span className="count-text">câu</span>
                </div>

                {/* Nút bắt đầu */}
                <Button 
                    onClick={handleStart}
                    disabled={sentenceCount === 0}
                    className="start-button"
                >
                    <FaPlay /> Bắt đầu luyện tập
                </Button>
            </div>
        </div>
    );
};

export default SettingsScreen;
