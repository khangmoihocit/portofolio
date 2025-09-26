// src/components/Header/Header.jsx
import React, { useState, useEffect } from 'react';
import { Link as ScrollLink } from 'react-scroll';
import { useTranslation } from 'react-i18next';
import Button from '../common/Button';
import '../../styles/components/_header.scss';
import useScrollHandling from '../../hooks/useScrollHandling';
import MenuLanguage from '../common/MenuLanguage/MenuLanguage';
import Theme from '../common/Theme/Theme';

const Header = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { t } = useTranslation();

    const { scrollPosition } = useScrollHandling();
    const [fixedPosition, setFixedPosition] = useState(false);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const handleHireMeClick = () => {
        const contactElement = document.getElementById('contact');
        if (contactElement) {
            contactElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    };

    const navigationItems = [
        { id: 'hero', number: '01', label: t('header.home') },
        { id: 'about', number: '02', label: t('header.about') },
        { id: 'resume', number: '03', label: t('header.resume') },
        { id: 'portfolio', number: '04', label: t('header.works') },
        { id: 'blog', number: '05', label: t('header.blog') },
        { id: 'contact', number: '06', label: t('header.contact') }
    ];

    useEffect(() => {
        console.log(scrollPosition);
        setFixedPosition(scrollPosition > 80 ? true : false);
        console.log(fixedPosition);
    }, [scrollPosition]);

    return (
        <header className={`header ${fixedPosition ? 'fixedHeader' : ''}`}>
            <a href='#' className='header__logo'>
                {t('header.logo')}
            </a>

            <nav className='header__nav'>
                {navigationItems.map(item => (
                    <ScrollLink
                        key={item.id}
                        to={item.id}
                        spy={true}
                        smooth={true}
                        offset={-120}
                        duration={200}
                        activeClass='active'
                        className='header__nav-link'
                    >
                        {/* <span className='header__nav-link__number'>
                            {item.number}.
                        </span> */}
                        {item.label}
                    </ScrollLink>
                ))}
            </nav>

            <div className="header__actions">
                <MenuLanguage />
                <Theme />
                <Button onClick={handleHireMeClick}>{t('header.hireMe')}</Button>
            </div>

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
                            offset={-120}
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
                <div className="header__mobile-menu__button">
                    <Button
                        onClick={() => {
                            handleHireMeClick();
                            setIsMobileMenuOpen(false);
                        }}
                    >
                        {t('header.hireMe')}
                    </Button>
                </div>
            </div>
        </header>
    );
};

export default Header;
