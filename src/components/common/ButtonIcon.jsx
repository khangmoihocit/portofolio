import React from 'react';
import { FaArrowUp } from 'react-icons/fa';
import useScrollHandling from '../../hooks/useScrollHandling';
import '../../styles/components/_scrollToTopButton.scss';
import { BiChevronUp } from "react-icons/bi";
const ScrollToTopButton = ({icon}) => {
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
        // <div className={`scroll-to-top ${isVisible ? 'visible' : ''}`}>
            <button
                type="button"
                onClick={scrollToTop}
                className="scroll-to-top__button"
                aria-label="Cuộn lên đầu trang"
            >
                <span className="scroll-to-top__text">
                    {/* <BiChevronUp style={{fontSize:"24px"}}/> */}
                    {icon}
                </span>
            </button>
        // </div>
    );
};

export default ScrollToTopButton;