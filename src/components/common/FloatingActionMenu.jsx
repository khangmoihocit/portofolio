import React, { useState } from 'react';
import { FaRobot } from 'react-icons/fa';
import '../../styles/components/_floatingActionMenu.scss';
import ButtonIcon from './ButtonIcon';
import Chatbot from './Chatbot';

const FloatingActionMenu = () => {
    const [isChatOpen, setIsChatOpen] = useState(false);

    const toggleChatbot = () => {
        setIsChatOpen(prev => !prev);
    };

    return (
        <>
            {isChatOpen && (
                <div className='chatbot-container'>
                    <Chatbot handleClose={toggleChatbot} />
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
