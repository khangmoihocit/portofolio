import React, { useState, useEffect, useRef } from 'react';
import {
    FaPaperPlane,
    FaSync,
    FaTimes,
    FaWindowMinimize
} from 'react-icons/fa';
import '../../styles/components/_chatbot.scss';
import { FaRobot } from 'react-icons/fa';
import {
    getGeminiResponse,
    checkGeminiApiKey
} from '../../services/geminiService';

const initialMessages = [
    {
        id: 1,
        sender: 'bot',
        text: 'Chào bạn! Tôi là trợ lý ảo của Khang. Bạn có thể hỏi tôi về kỹ năng, dự án, kinh nghiệm, hoặc cách liên hệ với anh ấy! 😊'
    }
];

const Chatbot = ({ handleClose }) => {
    const [messages, setMessages] = useState(initialMessages);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [hasApiKey, setHasApiKey] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    // Kiểm tra API key khi component mount
    useEffect(() => {
        setHasApiKey(checkGeminiApiKey());
        inputRef.current?.focus();
    }, []);

    // Tự động cuộn xuống tin nhắn mới nhất
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async () => {
        if (inputValue.trim() === '' || isLoading) return;

        const userMessage = {
            id: Date.now(),
            sender: 'user',
            text: inputValue
        };
        setMessages(prev => [...prev, userMessage]);
        const currentInput = inputValue;
        setInputValue('');
        setIsLoading(true);

        try {
            // Gọi API Gemini với context đầy đủ
            const botResponseText = await getGeminiResponse(
                currentInput,
                messages
            );
            const botMessage = {
                id: Date.now() + 1,
                sender: 'bot',
                text:
                    botResponseText ||
                    'Xin lỗi, tôi không thể trả lời câu hỏi này lúc này. Bạn có thể thử hỏi về kỹ năng, dự án, hoặc kinh nghiệm của Khang không? 😅'
            };

            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error('Lỗi khi gửi tin nhắn:', error);

            const errorMessage = {
                id: Date.now() + 1,
                sender: 'bot',
                text: !hasApiKey
                    ? 'Tính năng AI chat chưa được cấu hình. Bạn có thể liên hệ trực tiếp qua form contact trên website nhé! 📞'
                    : 'Xin lỗi, có lỗi xảy ra. Tôi vẫn có thể trả lời các câu hỏi cơ bản về Khang. Bạn muốn biết gì về anh ấy? 😊'
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
            inputRef.current?.focus();
        }
    };

    const handleRefresh = () => {
        setMessages(initialMessages);
        setInputValue('');
        setIsLoading(false);
    };

    const handleKeyPress = event => {
        if (event.key === 'Enter') {
            handleSendMessage();
        }
    };

    return (
        <div className='chatbot-widget'>
            {/* Header */}
            <header className='chatbot-header'>
                <div className='chatbot-header__info'>
                    <span className='chatbot-header__icon'>
                        <FaRobot />
                    </span>
                    <div>
                        <h3 className='chatbot-header__title'>
                            KhangMoiHocIT Bot
                        </h3>
                        <p className='chatbot-header__status'>We're online</p>
                    </div>
                </div>
                <div className='chatbot-header__actions'>
                    <button
                        onClick={handleRefresh}
                        aria-label='Refresh conversation'
                    >
                        <FaSync />
                    </button>
                    <button aria-label='Minimize widget'>
                        <FaWindowMinimize />
                    </button>
                    <button onClick={handleClose} aria-label='Close widget'>
                        <FaTimes />
                    </button>
                </div>
            </header>

            {/* Message Area */}
            <main className='chatbot-messages'>
                <p className='chatbot-messages__date'>September 27, 2025</p>
                {messages.map(msg => (
                    <div
                        key={msg.id}
                        className={`message-bubble message-bubble--${msg.sender}`}
                    >
                        <div
                            className='message-content'
                            dangerouslySetInnerHTML={{
                                __html: msg.text
                                    .replace(/\n/g, '<br/>')
                                    .replace(
                                        /\*\*(.*?)\*\*/g,
                                        '<strong>$1</strong>'
                                    )
                                    .replace(/\*(.*?)\*/g, '<em>$1</em>')
                            }}
                        />
                    </div>
                ))}
                {/* Hiệu ứng "Bot is typing..." */}
                {isLoading && (
                    <div className='message-bubble message-bubble--bot is-typing'>
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </main>

            {/* Input Area */}
            <footer className='chatbot-input'>
                <input
                    type='text'
                    placeholder={
                        hasApiKey
                            ? 'Hỏi về kỹ năng, dự án của Khang...'
                            : 'Enter message'
                    }
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    // disabled={isLoading}
                />
                <button
                    onClick={handleSendMessage}
                    aria-label='Send message'
                    disabled={isLoading || inputValue.trim() === ''}
                    className={isLoading ? 'loading' : ''}
                >
                    <FaPaperPlane />
                </button>
            </footer>
        </div>
    );
};

export default Chatbot;
