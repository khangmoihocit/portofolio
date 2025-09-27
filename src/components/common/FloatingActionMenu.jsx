import React, { useState } from 'react';
import { FaRobot } from 'react-icons/fa';
import '../../styles/components/_floatingActionMenu.scss';
import ButtonIcon from './ButtonIcon';
import Chatbot from './Chatbot';

const FloatingActionMenu = () => {
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [isFullScreen, setIsFullScreen] = useState(false);

    const toggleChatbot = () => {
        if (isChatOpen) {
            setIsFullScreen(false); // Reset fullscreen trước khi đóng chat
        }
        setIsChatOpen(prev => !prev);
    };

    const handleFullScreenChange = (fullScreen) => {
        setIsFullScreen(fullScreen);
    };

    return (
        <>
            {isChatOpen && (
                <div className={`chatbot-container ${isFullScreen ? 'chatbot-container--fullscreen' : ''}`}>
                    <Chatbot 
                        handleClose={toggleChatbot}
                        onFullScreenChange={handleFullScreenChange}
                    />
                </div>
            )}
            <div className={`fab-menu visible`}>
                {/* Chatbot Button */}
                <div className='fab-menu__button fab-menu__button--chatbot'>
                    <ButtonIcon onClick={toggleChatbot} icon={<FaRobot />} />
                </div>
            </div>
        </>
    );
};

export default FloatingActionMenu;
