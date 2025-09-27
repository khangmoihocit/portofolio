import React from 'react';
import '../../styles/components/_scrollToTopButton.scss';
import useScrollHandling from '../../hooks/useScrollHandling';
import ButtonIcon from './ButtonIcon';
import { BiChevronUp } from "react-icons/bi";
const ScrollToTopButton = () => {
     const { scrollPosition } = useScrollHandling();

    // Nút sẽ hiển thị khi người dùng cuộn xuống hơn 400px
    const isVisible = scrollPosition > 400;

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <div className={`scroll-to-top ${isVisible ? 'visible' : ''}`}>
            <ButtonIcon onClick={scrollToTop} icon={<BiChevronUp />}/>
        </div>
    );
};

export default ScrollToTopButton;