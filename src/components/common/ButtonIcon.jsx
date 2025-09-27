import React from 'react';
import '../../styles/components/_scrollToTopButton.scss';

const ButtonIcon = ({ icon, ...props }) => {
    return (
        <button
            type='button'
            className='scroll-to-top__button'
            aria-label='Cuộn lên đầu trang'
            {...props}
        >
            <span className='scroll-to-top__text'>{icon}</span>
        </button>
    );
};

export default ButtonIcon;
