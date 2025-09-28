import React, { useState, useEffect, useRef, useMemo } from 'react';
import { FaRobot } from 'react-icons/fa';
import '../../styles/components/_floatingActionMenu.scss';
import ButtonIcon from './ButtonIcon';
import Chatbot from './Chatbot';
import { useTranslation } from 'react-i18next';

const FloatingActionMenu = () => {
    const { t } = useTranslation();
    const chatPopups = useMemo(() => {
        return [
            t('chatbot.chatPopups.content1'),
            t('chatbot.chatPopups.content2'),
            t('chatbot.chatPopups.content3'),
            t('chatbot.chatPopups.content4')
        ];
    }, [t]);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [popupText, setPopupText] = useState(chatPopups[0]);
    const [displayedText, setDisplayedText] = useState('');
    const [showPopup, setShowPopup] = useState(false);
    const typingIntervalRef = useRef(null);

    const toggleChatbot = () => {
        if (isChatOpen) {
            setIsFullScreen(false);
        }
        setIsChatOpen(prev => !prev);
        setShowPopup(false);
    };

    const handleFullScreenChange = fullScreen => {
        setIsFullScreen(fullScreen);
    };

    // Effect này sẽ quản lý việc hiển thị và thay đổi text
    useEffect(() => {
        if (isChatOpen) {
            setShowPopup(false);
            return;
        }

        const initialTimeout = setTimeout(() => setShowPopup(true), 2000);

        const textChangeInterval = setInterval(() => {
            setPopupText(currentText => {
                const currentIndex = chatPopups.indexOf(currentText);
                const nextIndex = (currentIndex + 1) % chatPopups.length;
                return chatPopups[nextIndex];
            });
        }, 5000);

        return () => {
            clearTimeout(initialTimeout);
            clearInterval(textChangeInterval);
        };
    }, [isChatOpen, chatPopups]);

    //hiệu ứng gõ chữ
    useEffect(() => {
        if (typingIntervalRef.current) {
            clearInterval(typingIntervalRef.current);
        }

        if (showPopup && !isChatOpen) {
            setDisplayedText('');

            let i = 0;
            typingIntervalRef.current = setInterval(() => {
                if (i < popupText.length) {
                    setDisplayedText(popupText.substring(0, i + 1));
                    i++;
                } else {
                    clearInterval(typingIntervalRef.current);
                }
            }, 100); // Tốc độ gõ chữ
        }

        // Hàm cleanup sẽ chạy khi component unmount hoặc dependencies thay đổi
        return () => clearInterval(typingIntervalRef.current);
    }, [popupText, showPopup, isChatOpen]);

    //reset text khi ngôn ngữ thay đổi
    useEffect(() => {
        setPopupText(chatPopups[0]);
    }, [chatPopups]);

    return (
        <>
            {isChatOpen && (
                <div
                    className={`chatbot-container ${
                        isFullScreen ? 'chatbot-container--fullscreen' : ''
                    }`}
                >
                    <Chatbot
                        handleClose={toggleChatbot}
                        onFullScreenChange={handleFullScreenChange}
                    />
                </div>
            )}
            <div className={`fab-menu visible`}>
                {showPopup && !isChatOpen && (
                    <div className='fab-menu__popup-bubble'>
                        <span className='typing-text'>{displayedText}</span>
                    </div>
                )}

                <div className='fab-menu__button-wrapper'>
                    <div className='fab-menu__button fab-menu__button--chatbot'>
                        <ButtonIcon
                            onClick={toggleChatbot}
                            icon={<FaRobot />}
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default FloatingActionMenu;
