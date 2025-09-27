import React, { useState, useEffect, useRef } from 'react';
import {
    FaPaperPlane,
    FaSync,
    FaTimes,
    FaWindowMinimize,
    FaExpand,
    FaCompress
} from 'react-icons/fa';
import '../../styles/components/_chatbot.scss';
import { FaRobot } from 'react-icons/fa';
import {
    getGeminiResponse,
    checkGeminiApiKey
} from '../../services/geminiService';
import Theme from './Theme/Theme';

const initialMessages = [
    {
        id: 1,
        sender: 'bot',
        text: 'Chào bạn! Tôi là trợ lý ảo của Khang. Bạn có thể hỏi tôi về kỹ năng, dự án, kinh nghiệm, hoặc cách liên hệ với anh ấy! 😊'
    }
];

const Chatbot = ({ handleClose, onFullScreenChange }) => {
    const [messages, setMessages] = useState(() => {
        try {
            const savedMessages = sessionStorage.getItem('chatHistory');
            return savedMessages ? JSON.parse(savedMessages) : initialMessages;
        } catch (error) {
            console.error(
                'Could not parse chat history from sessionStorage',
                error
            );
            return initialMessages;
        }
    });
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [hasApiKey, setHasApiKey] = useState(false);
    const [currentDate, setCurrentDate] = useState('');
    const [isFullScreen, setIsFullScreen] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

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
        sessionStorage.removeItem('chatHistory'); // Xóa lịch sử đã lưu
    };

    const handleKeyPress = event => {
        if (event.key === 'Enter') {
            handleSendMessage();
        }
    };

    const toggleFullScreen = () => {
        const newFullScreenState = !isFullScreen;
        setIsFullScreen(newFullScreenState);
        
        // Thông báo cho parent component về thay đổi trạng thái fullscreen
        if (onFullScreenChange) {
            onFullScreenChange(newFullScreenState);
        }
    };

    // Thay đổi: Lưu tin nhắn vào sessionStorage
    useEffect(() => {
        try {
            // Chỉ lưu nếu cuộc trò chuyện đã bắt đầu
            if (messages.length > initialMessages.length) {
                sessionStorage.setItem('chatHistory', JSON.stringify(messages));
            }
        } catch (error) {
            console.error(
                'Could not save chat history to sessionStorage',
                error
            );
        }
    }, [messages]);

    // Kiểm tra API key khi component mount
    useEffect(() => {
        setHasApiKey(checkGeminiApiKey());
        inputRef.current?.focus();
    }, []);

    // Tự động cuộn xuống tin nhắn mới nhất
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Lấy và định dạng ngày hiện tại
    useEffect(() => {
        const today = new Date();
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        // Sử dụng 'en-US' để có định dạng "September 27, 2025"
        setCurrentDate(today.toLocaleDateString('en-US', options));
        console.log(isFullScreen);
    }, []);

    return (
        <div className={`chatbot-widget ${isFullScreen ? 'chatbot-widget__fullscreen' : ''}`}>
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
                    <button onClick={toggleFullScreen} aria-label={isFullScreen ? 'Exit fullscreen' : 'Enter fullscreen'}>
                        {isFullScreen ? <FaCompress /> : <FaExpand />}
                    </button>
                    <button onClick={handleClose} aria-label='Close widget'>
                        <FaTimes />
                    </button>
                </div>
            </header>

            <main className='chatbot-messages'>
                <p className='chatbot-messages__date'>{currentDate}</p>
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
                {isLoading && (
                    <div className='message-bubble message-bubble--bot is-typing'>
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </main>

            <footer className='chatbot-input'>
                <input
                    ref={inputRef}
                    type='text'
                    placeholder={
                        hasApiKey
                            ? 'Hỏi về kỹ năng, dự án của Khang...'
                            : 'Enter message'
                    }
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={isLoading}
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
