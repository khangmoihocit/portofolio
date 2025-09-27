import React from 'react';
import { FaArrowUp } from 'react-icons/fa';
import useScrollHandling from '../../hooks/useScrollHandling';
import '../../styles/components/_scrollToTopButton.scss';
import { BiChevronUp } from "react-icons/bi";

const ScrollToTopButton = () => {
    const { scrollPosition } = useScrollHandling();

    const isVisible = scrollPosition > 500;

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <div className={`scroll-to-top ${isVisible ? 'visible' : ''}`}>
            <button
                type="button"
                onClick={scrollToTop}
                className="scroll-to-top__button"
                aria-label="Cuộn lên đầu trang"
            >
                <span className="scroll-to-top__text">
                    <BiChevronUp style={{fontSize:"24px"}} />
                </span>
            </button>
        </div>
    );
};

export default ScrollToTopButton;