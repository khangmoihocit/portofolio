// src/components/Hero/Hero.jsx
import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaFacebookF, FaTwitter, FaGithub, FaLinkedinIn, FaDribbble } from 'react-icons/fa';
import profilePic from '../../assets/images/unnamed.jpg';

const HeroSection = styled.section`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding-top: 100px;
`;

const ProfileImage = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 30px;
  border: 4px solid var(--green);
`;

const Title = styled.h1`
  font-size: 4rem;
  font-weight: 700;
  line-height: 1.1;
  margin-bottom: 20px;
  color: var(--white);
`;

const GreenText = styled.span`
  color: var(--green);
`;

const Subtitle = styled.p`
  font-size: 18px; /* */
  max-width: 950px;
  margin-bottom: 30px;
  color: var(--light-slate); /* */
  line-height: 1.5;
`;

const SocialLinks = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
`;

const SocialIcon = styled.a`
  color: var(--light-slate);
  font-size: 20px;
  transition: color 0.3s, transform 0.3s;

  &:hover {
    color: var(--green);
    transform: translateY(-3px);
  }
`;

const ScrollDown = styled.div`
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 14px;
  color: var(--light-slate);
`;

const Hero = () => {
  return (
    <HeroSection id='hero'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <ProfileImage src={profilePic} alt="Joseph Bieber" />
        <Title>
          Hi, I am <GreenText>Khang</GreenText>
        </Title>
        <Subtitle>
          I am a frontend web developer. I can provide clean code and pixel perfect design. I also make website more & more interactive with web animations.
        </Subtitle>
        <SocialLinks>
          <SocialIcon href="#" target="_blank"><FaFacebookF /></SocialIcon>
          <SocialIcon href="#" target="_blank"><FaTwitter /></SocialIcon>
          <SocialIcon href="#" target="_blank"><FaGithub /></SocialIcon>
          <SocialIcon href="#" target="_blank"><FaLinkedinIn /></SocialIcon>
          <SocialIcon href="#" target="_blank"><FaDribbble /></SocialIcon>
        </SocialLinks>
      </motion.div>
      <ScrollDown>↓ SCROLL DOWN</ScrollDown>
    </HeroSection>
  );
};

export default Hero;