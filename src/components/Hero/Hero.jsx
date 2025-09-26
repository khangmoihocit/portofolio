// src/components/Hero/Hero.jsx
import React from 'react';
import { motion } from 'framer-motion';
import {
    FaFacebookF,
    FaTwitter,
    FaGithub,
    FaLinkedinIn,
    FaDribbble
} from 'react-icons/fa';
import { TypeAnimation } from 'react-type-animation';
import profilePic from '../../assets/images/unnamed.jpg';
import '../../styles/components/_hero.scss';
import Social from '../common/Social';

const Hero = () => {
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
                    Hi, I am{' '}
                    <TypeAnimation
                        className='hero__animated-text'
                        sequence={[
                            'Khang.',
                            1000,
                            'a backend developer.',
                            1000,
                            'a frontend developer.',
                            1000
                        ]}
                        wrapper='span'
                        speed={300}
                        deletionSpeed={50}
                        repeat={Infinity}
                    />
                </h1>

                <p className='hero__subtitle'>
                    I am a backend web developer, specializing in building
                    robust, scalable, and secure server-side applications. I
                    focus on writing clean, efficient code and designing
                    optimized databases to ensure high performance and
                    reliability
                </p>

                <Social />
            </motion.div>

            <div className='hero__scroll-down'>
                <span className='hero__scroll-down__arrow'>↓</span>
                <span className='hero__scroll-down__text'>Scroll Down</span>
            </div>
        </section>
    );
};

export default Hero;
