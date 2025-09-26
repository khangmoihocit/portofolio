// src/components/Hero/Hero.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { TypeAnimation } from 'react-type-animation';
import profilePic from '../../assets/images/unnamed.jpg';
import '../../styles/components/_hero.scss';
import Social from '../common/Social';

const Hero = () => {
    const { t } = useTranslation();
    
    return (
        <section className='hero' id='hero'>
            <motion.div
                className='hero__content'
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <div className='hero__image-wrapper'>
                    <div className='hero__image-container'>
                        <span className='hero__image-animation'></span>
                        <div className='hero__image-holder'>
                            <img
                                src={profilePic}
                                alt='Khang - Frontend Developer'
                                className='hero__profile-image'
                            />
                        </div>
                    </div>
                </div>

                <h1 className='hero__title'>
                    {t('hero.hi')}{' '}
                    <TypeAnimation
                        className='hero__animated-text'
                        sequence={[
                            t('hero.name'),
                            1000,
                            t('hero.backendDev'),
                            1000,
                            t('hero.frontendDev'),
                            1000
                        ]}
                        wrapper='span'
                        speed={300}
                        deletionSpeed={50}
                        repeat={Infinity}
                    />
                </h1>

                <p className='hero__subtitle'>
                    {t('hero.description')}
                </p>

                <Social />
            </motion.div>

            <div className='hero__scroll-down'>
                <span className='hero__scroll-down__arrow'>↓</span>
                <span className='hero__scroll-down__text'>{t('hero.scrollDown')}</span>
            </div>
        </section>
    );
};

export default Hero;
