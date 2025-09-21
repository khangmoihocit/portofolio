import React from 'react';
import Social from '../common/Social';
import '../../styles/components/_footer.scss';

const Footer = () => {
    return (
        <div className='footer-container'>
            <div>
                <Social />
            </div>
            <div className='footer-text'>
                © 2025, All right reserved {' '}
                <a href='https://github.com/khangmoihocit' target='_blank'>
                    khangmoihocit
                </a>
            </div>
        </div>
    );
};

export default Footer;
