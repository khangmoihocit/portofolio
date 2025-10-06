import React from 'react';
import { FaTimes } from 'react-icons/fa';

const KeyboardGuide = ({ onClose }) => {
    const shortcuts = [
        { key: '1', description: 'Ôn lại sau 1 phút', condition: 'Sau khi kiểm tra' },
        { key: '2', description: 'Ôn lại sau 5 phút', condition: 'Sau khi kiểm tra' },
        { key: '3', description: 'Ôn lại sau 10 phút', condition: 'Sau khi kiểm tra' },
        { key: '4', description: 'Đánh dấu đã nhớ', condition: 'Sau khi kiểm tra' },
        { key: 'Ctrl + <', description: 'Quay lại từ trước', condition: 'Bất kỳ lúc nào' },
        { key: 'Ctrl + >', description: 'Chuyển từ tiếp theo', condition: 'Bất kỳ lúc nào' },
        { key: 'Enter', description: 'Kiểm tra đáp án / Nhập lại', condition: 'Khi nhập từ' },
    ];

    return (
        <div className="keyboard-guide-overlay" onClick={onClose}>
            <div className="keyboard-guide" onClick={(e) => e.stopPropagation()}>
                <div className="guide-header">
                    <h3>⌨️ Phím tắt</h3>
                    <button className="close-btn" onClick={onClose}>
                        <FaTimes />
                    </button>
                </div>
                <div className="guide-content">
                    <table className="shortcuts-table">
                        <thead>
                            <tr>
                                <th>Phím</th>
                                <th>Chức năng</th>
                                <th>Điều kiện</th>
                            </tr>
                        </thead>
                        <tbody>
                            {shortcuts.map((shortcut, index) => (
                                <tr key={index}>
                                    <td>
                                        <kbd className="key">{shortcut.key}</kbd>
                                    </td>
                                    <td>{shortcut.description}</td>
                                    <td className="condition">{shortcut.condition}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="guide-footer">
                    <p>💡 Sử dụng phím tắt để luyện tập nhanh hơn!</p>
                </div>
            </div>
        </div>
    );
};

export default KeyboardGuide;
