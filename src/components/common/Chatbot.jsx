import React, { useState, useEffect, useRef } from 'react';
import { FaPaperPlane, FaSync, FaTimes, FaWindowMinimize } from 'react-icons/fa';
import '../../styles/components/_chatbot.scss';
import {FaRobot} from 'react-icons/fa';
// Dữ liệu chat ban đầu để minh họa
const initialMessages = [
    { id: 1, sender: 'bot', text: 'Chào bạn! Rất vui được gặp bạn 👋' },
    { id: 2, sender: 'bot', text: 'Chúng tôi đang có mã giảm giá 10% cho khách hàng mới! Bạn có muốn nhận ngay bây giờ không?' }
];

const Chatbot = ({ handleClose }) => {
    const [messages, setMessages] = useState(initialMessages);
    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef(null);

    // Tự động cuộn xuống tin nhắn mới nhất
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = () => {
        if (inputValue.trim() === '') return;

        // Thêm tin nhắn của người dùng
        const userMessage = { id: Date.now(), sender: 'user', text: inputValue };
        
        // Giả lập bot trả lời sau 1 giây
        setTimeout(() => {
            const botResponse = { id: Date.now() + 1, sender: 'bot', text: 'Cảm ơn bạn đã nhắn tin. Tôi sẽ phản hồi sớm nhất có thể.' };
            setMessages(prev => [...prev, botResponse]);
        }, 1000);

        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleSendMessage();
        }
    };

    return (
        <div className="chatbot-widget">
            {/* Header */}
            <header className="chatbot-header">
                <div className="chatbot-header__info">
                    <span className="chatbot-header__icon"><FaRobot /></span>
                    <div>
                        <h3 className="chatbot-header__title">KhangMoiHocIT Bot</h3>
                        <p className="chatbot-header__status">We're online</p>
                    </div>
                </div>
                <div className="chatbot-header__actions">
                    <button aria-label="Refresh conversation"><FaSync /></button>
                    <button aria-label="Minimize widget"><FaWindowMinimize /></button>
                    <button onClick={handleClose} aria-label="Close widget"><FaTimes /></button>
                </div>
            </header>

            {/* Message Area */}
            <main className="chatbot-messages">
                <p className="chatbot-messages__date">September 27, 2025</p>
                {messages.map(msg => (
                    <div key={msg.id} className={`message-bubble message-bubble--${msg.sender}`}>
                        {msg.text}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </main>

            {/* Input Area */}
            <footer className="chatbot-input">
                <input
                    type="text"
                    placeholder="Enter message"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                />
                <button onClick={handleSendMessage} aria-label="Send message">
                    <FaPaperPlane />
                </button>
            </footer>
        </div>
    );
};

export default Chatbot;
