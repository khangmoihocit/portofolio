import React from 'react';
import { FaArrowUp, FaRobot, FaFacebookMessenger } from 'react-icons/fa';
import { SiZalo } from 'react-icons/si'; // Sử dụng icon Zalo từ Simple Icons
import useScrollHandling from '../../hooks/useScrollHandling';
import '../../styles/components/_floatingActionMenu.scss';
import ScrollToTopButton from './ButtonIcon';
import messenger from '../../assets/images/messenger.png'
import { BiChevronUp } from "react-icons/bi";

const FloatingActionMenu = () => {
    const { scrollPosition } = useScrollHandling();
    const isVisible = scrollPosition > 400;

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleChatbotClick = () => {
        // Thêm logic mở chatbot của bạn ở đây
        alert('Chatbot feature is coming soon!');
    };

    const zaloLink = 'https://zalo.me/0966519641';
    const messengerLink = 'https://m.me/your-facebook-page-id';

    return (
        <div className={`fab-menu ${isVisible ? 'visible' : ''}`}>
            {/* Scroll to Top Button */}
            <div>
                <ScrollToTopButton icon={<BiChevronUp />}/>
            </div>

            {/* Chatbot Button */}
            <button
                type='button'
                onClick={handleChatbotClick}
                className='fab-menu__button fab-menu__button--chatbot'
                aria-label='Mở Chatbot'
            >
                <ScrollToTopButton icon={<FaRobot />}/>
            </button>

            {/* Zalo Button */}
            <a
                href={zaloLink}
                target='_blank'
                rel='noopener noreferrer'
                className='fab-menu__button fab-menu__button--zalo'
                aria-label='Chat on Zalo'
            >
                <SiZalo />
            </a>

            {/* Messenger Button */}
            <a
                href={messengerLink}
                target='_blank'
                rel='noopener noreferrer'
                className='fab-menu__button fab-menu__button--messenger'
                aria-label='Chat on Messenger'
            >
                <img src={messenger} alt="messenger" />
            </a>
        </div>
    );
};

export default FloatingActionMenu;