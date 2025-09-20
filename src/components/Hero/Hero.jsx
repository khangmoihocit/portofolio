// src/components/Hero/Hero.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { FaFacebookF, FaTwitter, FaGithub, FaLinkedinIn, FaDribbble } from 'react-icons/fa';
import { TypeAnimation } from 'react-type-animation';
import profilePic from '../../assets/images/unnamed.jpg';
import '../../styles/components/_hero.scss';

const Hero = () => {
  const SocialLinkItem = ({ icon: Icon, href, ariaLabel }) => (
    <a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer"
      className="hero__social-icon"
      aria-label={ariaLabel}
    >
      <span className="hero__social-icon__wrapper">
        <span className="hero__social-icon__state hero__social-icon__state--default">
          <Icon size={20} />
        </span>
        <span className="hero__social-icon__state hero__social-icon__state--hover">
          <Icon size={20} />
        </span>
      </span>
    </a>
  );

  const socialLinks = [
    { icon: FaFacebookF, href: "#", ariaLabel: "Facebook profile" },
    { icon: FaTwitter, href: "#", ariaLabel: "Twitter profile" },
    { icon: FaGithub, href: "#", ariaLabel: "GitHub profile" },
    { icon: FaLinkedinIn, href: "#", ariaLabel: "LinkedIn profile" },
    { icon: FaDribbble, href: "#", ariaLabel: "Dribbble profile" }
  ];

  return (
    <section className="hero" id="hero">
      <motion.div
        className="hero__content"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div style={{marginBottom: '30px', display: 'flex', justifyContent:'center'}}>
          <img 
          src={profilePic} 
          alt="Khang - Frontend Developer" 
          className="hero__profile-image"
        />
        </div>
        
        <h1 className="hero__title">
          Hi, I am{' '}
          <TypeAnimation
            className="hero__animated-text"
            sequence={[
              'Khang.', 1000, 
              'a frontend developer.', 1000,
              'a backend developer.', 1000
            ]}
            wrapper="span"
            speed={300}
            deletionSpeed={50}
            repeat={Infinity}
          />
        </h1>
        
        <p className="hero__subtitle">
          I am a frontend web developer. I can provide clean code and pixel perfect design. 
          I also make website more & more interactive with web animations.
        </p>
        
        <div className="hero__social-links">
          {socialLinks.map((social, index) => (
            <SocialLinkItem 
              key={index}
              icon={social.icon}
              href={social.href}
              ariaLabel={social.ariaLabel}
            />
          ))}
        </div>
      </motion.div>
      
      <div className="hero__scroll-down">
        <span className="hero__scroll-down__arrow">↓</span>
        <span className="hero__scroll-down__text">Scroll Down</span>
      </div>
    </section>
  );
};

export default Hero;