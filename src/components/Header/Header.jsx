// src/components/Header/Header.jsx
import React, { useState, useEffect } from 'react';
import { Link as ScrollLink } from 'react-scroll';
import Button from '../common/Button';
import '../../styles/components/_header.scss';
import useScrollHandling from '../../hooks/useScrollHandling';

const Header = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const { scrollPosition } = useScrollHandling();
    const [fixedPosition, setFixedPosition] = useState(false);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const navigationItems = [
        { id: 'hero', number: '01', label: 'HOME' },
        { id: 'about', number: '02', label: 'ABOUT' },
        { id: 'resume', number: '03', label: 'RESUME' },
        { id: 'works', number: '04', label: 'WORKS' },
        { id: 'blog', number: '05', label: 'BLOG' },
        { id: 'contact', number: '06', label: 'CONTACT' }
    ];

    useEffect(() => {
        console.log(scrollPosition);
        setFixedPosition(scrollPosition > 80 ? true : false);
        console.log(fixedPosition);
    }, [scrollPosition]);

    return (
        <header className={`header ${fixedPosition ? 'fixedHeader' : ''}`}>
            <a href='#' className='header__logo'>
                KHANGMOIHOCIT.
            </a>

            <nav className='header__nav'>
                {navigationItems.map(item => (
                    <ScrollLink
                        key={item.id}
                        to={item.id}
                        spy={true}
                        smooth={true}
                        duration={200}
                        activeClass='active'
                        className='header__nav-link'
                    >
                        <span className='header__nav-link__number'>
                            {item.number}.
                        </span>
                        {item.label}
                    </ScrollLink>
                ))}
            </nav>

            <Button>HIRE ME</Button>

            {/* Mobile menu toggle */}
            <div
                className={`header__mobile-toggle ${
                    isMobileMenuOpen ? 'header__mobile-toggle--open' : ''
                }`}
                onClick={toggleMobileMenu}
                role='button'
                tabIndex={0}
                onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        toggleMobileMenu();
                    }
                }}
            >
                <div className='header__mobile-toggle__bar'></div>
                <div className='header__mobile-toggle__bar'></div>
                <div className='header__mobile-toggle__bar'></div>
            </div>

            {/* Mobile menu */}
            <div
                className={`header__mobile-menu ${
                    isMobileMenuOpen ? 'header__mobile-menu--open' : ''
                }`}
            >
                <nav className='header__nav'>
                    {navigationItems.map(item => (
                        <ScrollLink
                            key={item.id}
                            to={item.id}
                            spy={true}
                            smooth={true}
                            duration={500}
                            activeClass='active'
                            className='header__nav-link'
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            <span className='header__nav-link__number'>
                                {item.number}.
                            </span>
                            {item.label}
                        </ScrollLink>
                    ))}
                </nav>
            </div>
        </header>
    );
};

export default Header;
