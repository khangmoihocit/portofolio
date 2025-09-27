import React, { useState, useEffect, useRef } from 'react';
import {
    FaPaperPlane,
    FaSync,
    FaTimes,
    FaExpand,
    FaCompress,
    FaKey,
    FaExclamationTriangle,
    FaCog,
    FaChartLine
} from 'react-icons/fa';
import '../../styles/components/_chatbot.scss';
import { FaRobot } from 'react-icons/fa';
import {
    getGeminiResponse,
    checkGeminiApiKey,
    getApiKeyStatus
} from '../../services/geminiService';
import { useLoadBalancerMonitor } from '../../hooks/useLoadBalancerMonitor';

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
    const [showPerformancePanel, setShowPerformancePanel] = useState(false);
    const [requestStartTime, setRequestStartTime] = useState(null);
    const [lastResponseTime, setLastResponseTime] = useState(null);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    // Load balancer monitoring
    const { metrics, healthScore, trends, recommendations, isHealthy } =
        useLoadBalancerMonitor();

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
        setRequestStartTime(Date.now());

        try {
            // Gọi API Gemini với load balancer
            const botResponseText = await getGeminiResponse(
                currentInput,
                messages
            );

            const responseTime = Date.now() - requestStartTime;
            setLastResponseTime(responseTime);

            const botMessage = {
                id: Date.now() + 1,
                sender: 'bot',
                text:
                    botResponseText ||
                    'Xin lỗi, tôi không thể trả lời câu hỏi này lúc này. Bạn có thể thử hỏi về kỹ năng, dự án, hoặc kinh nghiệm của Khang không? 😅',
                responseTime
            };

            setMessages(prev => [...prev, botMessage]);
            
            setTimeout(() => {
                inputRef.current?.focus();
            }, 100);
            
        } catch (error) {
            console.error('Lỗi khi gửi tin nhắn:', error);
            const responseTime = Date.now() - requestStartTime;
            setLastResponseTime(responseTime);

            const errorMessage = {
                id: Date.now() + 1,
                sender: 'bot',
                text: !hasApiKey
                    ? 'Tính năng AI chat chưa được cấu hình. Bạn có thể liên hệ trực tiếp qua form contact trên website nhé! 📞'
                    : 'Xin lỗi, có lỗi xảy ra. Hệ thống sẽ tự động thử lại với API key khác. Bạn vui lòng thử lại nhé! 😊',
                responseTime,
                isError: true
            };
            setMessages(prev => [...prev, errorMessage]);
            
            setTimeout(() => {
                inputRef.current?.focus();
            }, 100);
            
        } finally {
            setIsLoading(false);
            setRequestStartTime(null);
            
            // Fallback focus nếu các focus trên không hoạt động
            setTimeout(() => {
                if (inputRef.current) {
                    inputRef.current.focus();
                    inputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }, 150);
        }
    };

    const handleRefresh = () => {
        setMessages(initialMessages);
        setInputValue('');
        setIsLoading(false);
        sessionStorage.removeItem('chatHistory'); // Xóa lịch sử đã lưu
        
        // Focus vào input sau khi refresh
        setTimeout(() => {
            inputRef.current?.focus();
        }, 100);
    };

    const handleKeyPress = event => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault(); // Ngăn xuống dòng khi nhấn Enter
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
        
        setTimeout(() => {
            inputRef.current?.focus();
        }, 300);
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
        
        setTimeout(() => {
            inputRef.current?.focus();
        }, 500);
    }, []);

    // Tự động cuộn xuống tin nhắn mới nhất và focus input
    useEffect(() => {
        scrollToBottom();
        
        if (messages.length > 1) {
            setTimeout(() => {
                inputRef.current?.focus();
            }, 200);
        }
    }, [messages]);

    // Lấy và định dạng ngày hiện tại
    useEffect(() => {
        const today = new Date();
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        setCurrentDate(today.toLocaleDateString('en-US', options));
        console.log(isFullScreen);
    }, []);

    return (
        <div
            className={`chatbot-widget ${
                isFullScreen ? 'chatbot-widget__fullscreen' : ''
            }`}
        >
            <header className='chatbot-header'>
                <div className='chatbot-header__info'>
                    <span className='chatbot-header__icon'>
                        <FaRobot />
                    </span>
                    <div>
                        <h3 className='chatbot-header__title'>
                            KhangMoiHocIT Bot
                        </h3>
                        <p className='chatbot-header__status'>
                            {isHealthy ? (
                                <>
                                    <span className='status-indicator healthy'>
                                        ●
                                    </span>
                                    {metrics.healthyKeys}/{metrics.totalKeys}{' '}
                                    keys • {metrics.systemLoad} load
                                </>
                            ) : (
                                <>
                                    <FaExclamationTriangle className='status-indicator warning' />
                                    System degraded
                                </>
                            )}
                            {lastResponseTime && (
                                <span className='response-time'>
                                    • {lastResponseTime}ms
                                </span>
                            )}
                        </p>
                    </div>
                </div>
                <div className='chatbot-header__actions'>
                    <button
                        onClick={() => {
                            const newState = !showPerformancePanel;
                            setShowPerformancePanel(newState);
                            
                            // Focus vào input khi đóng performance panel để tiếp tục chat
                            if (!newState) {
                                setTimeout(() => {
                                    inputRef.current?.focus();
                                }, 100);
                            }
                        }}
                        aria-label='Toggle performance panel'
                        className={showPerformancePanel ? 'active' : ''}
                        title={`Health Score: ${healthScore}%`}
                    >
                        <FaChartLine />
                    </button>
                    <button
                        onClick={handleRefresh}
                        aria-label='Refresh conversation'
                    >
                        <FaSync />
                    </button>
                    <button
                        onClick={toggleFullScreen}
                        aria-label={
                            isFullScreen
                                ? 'Exit fullscreen'
                                : 'Enter fullscreen'
                        }
                    >
                        {isFullScreen ? <FaCompress /> : <FaExpand />}
                    </button>
                    <button onClick={handleClose} aria-label='Close widget'>
                        <FaTimes />
                    </button>
                </div>
            </header>

            {showPerformancePanel && (
                <div className='performance-panel'>
                    <div className='performance-header'>
                        <h4>Performance Dashboard</h4>
                        <div className='health-score'>
                            <span className='score-value'>{healthScore}</span>
                            <span className='score-label'>Health Score</span>
                        </div>
                    </div>

                    <div className='performance-metrics'>
                        <div className='metric'>
                            <span className='metric-label'>Response Time</span>
                            <span
                                className={`metric-value ${
                                    trends.responseTime === 'UP'
                                        ? 'trend-up'
                                        : trends.responseTime === 'DOWN'
                                        ? 'trend-down'
                                        : ''
                                }`}
                            >
                                {metrics.averageResponseTime.toFixed(0)}ms
                            </span>
                        </div>

                        <div className='metric'>
                            <span className='metric-label'>Success Rate</span>
                            <span
                                className={`metric-value ${
                                    metrics.successRate >= 95
                                        ? 'good'
                                        : 'warning'
                                }`}
                            >
                                {metrics.successRate.toFixed(1)}%
                            </span>
                        </div>

                        <div className='metric'>
                            <span className='metric-label'>Queue</span>
                            <span
                                className={`metric-value ${
                                    metrics.queueSize > 10 ? 'warning' : ''
                                }`}
                            >
                                {metrics.queueSize}
                            </span>
                        </div>

                        <div className='metric'>
                            <span className='metric-label'>Active</span>
                            <span className='metric-value'>
                                {metrics.activeRequests}
                            </span>
                        </div>
                    </div>

                    {recommendations.length > 0 && (
                        <div className='performance-alerts'>
                            {recommendations.slice(0, 2).map((rec, index) => (
                                <div
                                    key={index}
                                    className={`alert alert-${rec.type.toLowerCase()}`}
                                >
                                    {rec.message}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

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
                            ? isLoading 
                                ? 'Đang xử lý...'
                                : 'Hỏi về kỹ năng, dự án của Khang...'
                            : 'Enter message'
                    }
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={isLoading}
                    autoFocus
                    autoComplete="off"
                    style={{
                        transition: 'all 0.2s ease',
                        transform: isLoading ? 'scale(0.99)' : 'scale(1)'
                    }}
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
