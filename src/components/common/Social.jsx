import React from 'react';
import {
    FaFacebookF,
    FaTwitter,
    FaGithub,
    FaLinkedinIn,
    FaDribbble
} from 'react-icons/fa';
import '../../styles/components/_hero.scss';

const Social = () => {
    const SocialLinkItem = ({ icon: Icon, href, ariaLabel }) => (
        <a
            href={href}
            target='_blank'
            rel='noopener noreferrer'
            className='hero__social-icon'
            aria-label={ariaLabel}
        >
            <span className='hero__social-icon__wrapper'>
                <span className='hero__social-icon__state hero__social-icon__state--default'>
                    <Icon size={20} />
                </span>
                <span className='hero__social-icon__state hero__social-icon__state--hover'>
                    <Icon size={20} />
                </span>
            </span>
        </a>
    );

    const socialLinks = [
        { icon: FaFacebookF, href: '#', ariaLabel: 'Facebook profile' },
        { icon: FaTwitter, href: '#', ariaLabel: 'Twitter profile' },
        { icon: FaGithub, href: 'https://github.com/khangmoihocit', ariaLabel: 'GitHub profile' },
        { icon: FaLinkedinIn, href: '#', ariaLabel: 'LinkedIn profile' },
        { icon: FaDribbble, href: '#', ariaLabel: 'Dribbble profile' }
    ];

    return (
        <div className='hero__social-links'>
            {socialLinks.map((social, index) => (
                <SocialLinkItem
                    key={index}
                    icon={social.icon}
                    href={social.href}
                    ariaLabel={social.ariaLabel}
                />
            ))}
        </div>
    );
};

export default Social;
