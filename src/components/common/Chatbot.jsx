import React, { useState, useEffect, useRef } from 'react';
import {
    FaPaperPlane,
    FaSync,
    FaTimes,
    FaExpand,
    FaCompress,
    FaExclamationTriangle,
    FaChartLine
} from 'react-icons/fa';
import '../../styles/components/_chatbot.scss';
import { FaRobot } from 'react-icons/fa';
import {
    getGeminiResponse,
    checkGeminiApiKey
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
            console.error('Không thể đọc lịch sử chat từ sessionStorage', error);
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
    const [typingMessageId, setTypingMessageId] = useState(null);
    const [displayedText, setDisplayedText] = useState('');
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    const typingIntervalRef = useRef(null);
    const { metrics, healthScore, trends, recommendations, isHealthy } = useLoadBalancerMonitor();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const typewriterEffect = (text, messageId) => {
        // Clear any existing typing effect
        if (typingIntervalRef.current) {
            clearInterval(typingIntervalRef.current);
        }

        setTypingMessageId(messageId);
        setDisplayedText('');
        let currentIndex = 0;

        typingIntervalRef.current = setInterval(() => {
            if (currentIndex < text.length) {
                setDisplayedText(text.substring(0, currentIndex + 1));
                currentIndex++;
            } else {
                clearInterval(typingIntervalRef.current);
                typingIntervalRef.current = null;
                setTypingMessageId(null);
            }
        }, 10); // Speed: 10ms per character (adjust for faster/slower typing)
    };

    const handleSendMessage = async () => {
        if (inputValue.trim() === '' || isLoading) return;

        const currentInput = inputValue;
        const userMessage = { id: Date.now(), sender: 'user', text: currentInput };
        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsLoading(true);
        setRequestStartTime(Date.now());

        try {
            console.log('[Chatbot] Sending message:', currentInput);
            const botResponseText = await getGeminiResponse(currentInput, messages);
            console.log('[Chatbot] Received response, length:', botResponseText?.length);
            const responseTime = Date.now() - requestStartTime;
            setLastResponseTime(responseTime);

            const botMessageId = Date.now() + 1;
            const botText = botResponseText || 'Xin lỗi, tôi không thể trả lời câu hỏi này lúc này. Bạn có thể thử hỏi về kỹ năng, dự án, hoặc kinh nghiệm của Khang không? 😅';
            
            const botMessage = {
                id: botMessageId,
                sender: 'bot',
                text: botText,
                responseTime
            };
            
            setMessages(prev => [...prev, botMessage]);
            
            // Start typing effect for the bot message
            typewriterEffect(botText, botMessageId);
        } catch (error) {
            console.error('[Chatbot] Error details:', {
                message: error.message,
                stack: error.stack,
                name: error.name
            });
            
            const errorMessageId = Date.now() + 1;
            const errorText = 'Rất tiếc, đã có lỗi xảy ra và không thể xử lý yêu cầu của bạn lúc này. Tin nhắn của bạn đã được khôi phục, bạn có thể thử gửi lại. 🙏';
            
            const finalErrorMessage = {
                id: errorMessageId,
                sender: 'bot',
                text: errorText,
                isError: true
            };
            setMessages(prev => [...prev, finalErrorMessage]);
            
            // Apply typing effect to error message too
            typewriterEffect(errorText, errorMessageId);
            
            setInputValue(currentInput); // Khôi phục lại tin nhắn của người dùng
        } finally {
            setIsLoading(false);
            setRequestStartTime(null);
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    };

    const handleRefresh = () => {
        // Clear typing effect
        if (typingIntervalRef.current) {
            clearInterval(typingIntervalRef.current);
            typingIntervalRef.current = null;
        }
        setTypingMessageId(null);
        setDisplayedText('');
        
        setMessages(initialMessages);
        setInputValue('');
        setIsLoading(false);
        sessionStorage.removeItem('chatHistory');
        setTimeout(() => inputRef.current?.focus(), 100);
    };

    const handleKeyPress = e => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const toggleFullScreen = () => {
        const newFullScreenState = !isFullScreen;
        setIsFullScreen(newFullScreenState);
        if (onFullScreenChange) {
            onFullScreenChange(newFullScreenState);
        }
        setTimeout(() => inputRef.current?.focus(), 300);
    };

    useEffect(() => {
        try {
            if (messages.length > initialMessages.length) {
                sessionStorage.setItem('chatHistory', JSON.stringify(messages));
            }
        } catch (error) {
            console.error('Không thể lưu lịch sử chat vào sessionStorage', error);
        }
    }, [messages]);

    useEffect(() => {
        setHasApiKey(checkGeminiApiKey());
        const today = new Date();
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        setCurrentDate(today.toLocaleDateString('en-US', options));
        setTimeout(() => inputRef.current?.focus(), 500);
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages, displayedText]);

    // Cleanup typing effect on unmount
    useEffect(() => {
        return () => {
            if (typingIntervalRef.current) {
                clearInterval(typingIntervalRef.current);
            }
        };
    }, []);

    return (
        <div className={`chatbot-widget ${isFullScreen ? 'chatbot-widget__fullscreen' : ''}`}>
            <header className='chatbot-header'>
                <div className='chatbot-header__info'>
                    <span className='chatbot-header__icon'><FaRobot /></span>
                    <div>
                        <h3 className='chatbot-header__title'>BotByKhang</h3>
                        <p className='chatbot-header__status'>
                            {isHealthy ? (
                                <>
                                    <span className='status-indicator healthy'>●</span>
                                    {metrics.healthyKeys}/{metrics.totalKeys} keys • {metrics.systemLoad} load
                                </>
                            ) : (
                                <>
                                    <FaExclamationTriangle className='status-indicator warning' />
                                    System degraded
                                </>
                            )}
                            {lastResponseTime && <span className='response-time'>• {lastResponseTime}ms</span>}
                        </p>
                    </div>
                </div>
                <div className='chatbot-header__actions'>
                    <button onClick={() => setShowPerformancePanel(prev => !prev)} aria-label='Toggle performance panel' className={showPerformancePanel ? 'active' : ''} title={`Health Score: ${healthScore}%`}>
                        <FaChartLine />
                    </button>
                    <button onClick={handleRefresh} aria-label='Refresh conversation'><FaSync /></button>
                    <button onClick={toggleFullScreen} aria-label={isFullScreen ? 'Exit fullscreen' : 'Enter fullscreen'}>
                        {isFullScreen ? <FaCompress /> : <FaExpand />}
                    </button>
                    <button onClick={handleClose} aria-label='Close widget'><FaTimes /></button>
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
                                <div key={index} className={`alert alert-${rec.type.toLowerCase()}`}>{rec.message}</div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            <main className='chatbot-messages'>
                <p className='chatbot-messages__date'>{currentDate}</p>
                {messages.map(msg => {
                    const isCurrentlyTyping = msg.id === typingMessageId;
                    const textToDisplay = isCurrentlyTyping ? displayedText : msg.text;
                    
                    return (
                        <div key={msg.id} className={`message-bubble message-bubble--${msg.sender}`}>
                            <div className='message-content'>
                                <span
                                    dangerouslySetInnerHTML={{ 
                                        __html: textToDisplay
                                            .replace(/\n/g, '<br/>')
                                            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                            .replace(/\*(.*?)\*/g, '<em>$1</em>') 
                                    }} 
                                />
                                {isCurrentlyTyping && <span className='typing-cursor'>▋</span>}
                            </div>
                        </div>
                    );
                })}
                {isLoading && (
                    <div className='message-bubble message-bubble--bot is-typing'>
                        <span></span><span></span><span></span>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </main>

            <footer className='chatbot-input'>
                <input
                    ref={inputRef}
                    type='text'
                    placeholder={hasApiKey ? (isLoading ? 'Đang xử lý...' : 'Hỏi về kỹ năng, dự án của Khang...') : 'Enter message'}
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={isLoading}
                    autoFocus
                    autoComplete="off"
                />
                <button onClick={handleSendMessage} aria-label='Send message' disabled={isLoading || inputValue.trim() === ''} className={isLoading ? 'loading' : ''}>
                    <FaPaperPlane />
                </button>
            </footer>
        </div>
    );
};

export default Chatbot;