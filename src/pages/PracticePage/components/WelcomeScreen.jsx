import React from 'react';
import { FaBook, FaPencilAlt } from 'react-icons/fa';

const WelcomeScreen = () => {
    return (
        <div className="welcome-screen">
            <FaBook className="welcome-icon" />
            <h2>Chào mừng đến với trang Luyện Tập</h2>
            <p>Chọn một chế độ luyện tập từ menu bên phải để bắt đầu:</p>
            <div className="feature-list">
                <div className="feature-item">
                    <FaPencilAlt />
                    <div>
                        <h3>Thực hành đặt câu với các từ vựng</h3>
                        <p>Nhập từ vựng và luyện tập đặt câu tiếng Anh với sự hỗ trợ của AI</p>
                    </div>
                </div>
                <div className="feature-item">
                    <FaBook />
                    <div>
                        <h3>Luyện dịch văn bản</h3>
                        <p>Học từ vựng và thực hành dịch các đoạn văn từ cơ bản đến nâng cao</p>
                    </div>
                </div>
                <div className="feature-item">
                    <FaPencilAlt />
                    <div>
                        <h3>Luyện dịch các câu giao tiếp</h3>
                        <p>Thực hành kỹ năng nói và phản xạ trong các tình huống giao tiếp hàng ngày</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WelcomeScreen;
