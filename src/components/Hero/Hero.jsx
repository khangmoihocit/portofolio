// src/components/Hero/Hero.jsx
import React from 'react';
import styled, { keyframes } from 'styled-components'; // Import keyframes
import { motion } from 'framer-motion';
import { FaFacebookF, FaTwitter, FaGithub, FaLinkedinIn, FaDribbble } from 'react-icons/fa';
import { TypeAnimation } from 'react-type-animation';
import profilePic from '../../assets/images/unnamed.jpg';

// ... (các styled-components khác giữ nguyên)
const HeroSection = styled.section`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
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
  font-size: 3rem;
  font-weight: 600;
  line-height: 1.1;
  margin-bottom: 20px;
  color: var(--white);
  min-height: 1.1em; 
`;

const AnimatedText = styled(TypeAnimation)`
  color: var(--green);
`;

const Subtitle = styled.p`
  font-size: 18px;
  max-width: 950px;
  margin-bottom: 30px;
  color: var(--light-slate);
  line-height: 1.5;
`;

const SocialLinks = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
`;

const SocialIcon = styled.a`
  position: relative;
  display: block;
  width: 35px;
  height: 35px;
  border-radius: 5px;
  overflow: hidden;
`;

const IconWrapper = styled.span`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 200%;
  transition: transform 0.4s cubic-bezier(.4,0,.2,1);
  ${SocialIcon}:hover & {
    transform: translateY(-50%);
  }
`;

const IconState = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 50%;
`;

const DefaultIcon = styled(IconState)`
  background-color: #162033;
  svg {
    color: var(--light-slate);
  }
`;

const HoverIcon = styled(IconState)`
  background-color: var(--green);
  svg {
    color: var(--navy);
  }
`;


// 1. ĐỊNH NGHĨA KEYFRAMES CHO HIỆU ỨNG BOUNCE
const bounce = keyframes`
  0%, 100% {
    transform: translateY(-25%);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  50% {
    transform: translateY(0);
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
`;

const ScrollDown = styled.div`
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 14px;
  color: var(--light-slate);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;

  /* 2. ÁP DỤNG ANIMATION VÀO MŨI TÊN */
  span {
    display: inline-block; /* Cần thiết để transform hoạt động */
    animation: ${bounce} 1.5s infinite; /* Tên animation, thời gian, lặp vô hạn */
  }
`;


const Hero = () => {
  // Component nội bộ để tái sử dụng code
  const SocialLinkItem = ({ icon: Icon, href }) => (
    <SocialIcon href={href} target="_blank">
      <IconWrapper>
        <DefaultIcon><Icon size={20} /></DefaultIcon>
        <HoverIcon><Icon size={20} /></HoverIcon>
      </IconWrapper>
    </SocialIcon>
  );

  return (
    <HeroSection id='hero'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <ProfileImage src={profilePic} alt="Joseph Bieber" />
        <Title>
          Hi, I am{' '}
          <AnimatedText
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
        </Title>
        <Subtitle>
          I am a frontend web developer. I can provide clean code and pixel perfect design. I also make website more & more interactive with web animations.
        </Subtitle>
        <SocialLinks>
          <SocialLinkItem href="#" icon={FaFacebookF} />
          <SocialLinkItem href="#" icon={FaTwitter} />
          <SocialLinkItem href="#" icon={FaGithub} />
          <SocialLinkItem href="#" icon={FaLinkedinIn} />
          <SocialLinkItem href="#" icon={FaDribbble} />
        </SocialLinks>
      </motion.div>
      {/* 3. TÁCH MŨI TÊN RA ĐỂ ÁP DỤNG ANIMATION */}
      <ScrollDown>
        <span>↓</span>
        SCROLL DOWN
      </ScrollDown>
    </HeroSection>
  );
};

export default Hero;