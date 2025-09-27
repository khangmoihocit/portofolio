import React, { useState, useEffect, useRef } from 'react';
import { FaPaperPlane, FaSync, FaTimes, FaWindowMinimize } from 'react-icons/fa';
import '../../styles/components/_chatbot.scss';
import {FaRobot} from 'react-icons/fa';

const initialMessages = [
    { id: 1, sender: 'bot', text: 'Chào bạn! Tôi là trợ lý ảo của Khang. Bạn cần tôi giúp gì không?' }
];

const Chatbot = ({ handleClose }) => {
    const [messages, setMessages] = useState(initialMessages);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    // Tự động cuộn xuống tin nhắn mới nhất
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

   const handleSendMessage = async () => {
        // if (inputValue.trim() === '' || isLoading) return;

        // const userMessage = { id: Date.now(), sender: 'user', text: inputValue };
        // setMessages(prev => [...prev, userMessage]);
        // setInputValue('');
        // setIsLoading(true);

        // // Gọi API Gemini và chờ câu trả lời
        // const botResponseText = await getGeminiResponse(inputValue, messages);
        // const botMessage = { id: Date.now() + 1, sender: 'bot', text: botResponseText };
        
        // setMessages(prev => [...prev, botMessage]);
        // setIsLoading(false);
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
                {/* Hiệu ứng "Bot is typing..." */}
                {isLoading && (
                    <div className="message-bubble message-bubble--bot is-typing">
                        <span></span><span></span><span></span>
                    </div>
                )}
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
                    disabled={isLoading}
                />
                <button onClick={handleSendMessage} aria-label="Send message">
                    <FaPaperPlane />
                </button>
            </footer>
        </div>
    );
};

export default Chatbot;
