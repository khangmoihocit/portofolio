// src/components/Header/Header.jsx
import React from 'react';
import styled from 'styled-components';
import { Link as ScrollLink } from 'react-scroll';
import Button from '../common/Button'; // Import Button chung

const HeaderContainer = styled.header`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0px 50px;
    height: 100px;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    background-color: rgba(15, 23, 42, 0.85);
    backdrop-filter: blur(10px);
    z-index: 1000;
`;

const Logo = styled.a`
    font-size: 28px;
    font-weight: 700;
    color: var(--green);
`;

const Nav = styled.nav`
    display: flex;
    align-items: center;
    gap: 40px;
`;

const NavLink = styled(ScrollLink)`
    position: relative; 
    font-size: 15px;
    cursor: pointer;
    color: var(--light-slate);
    padding-bottom: 5px; 
    transition: color 0.3s ease-in-out;

    span {
        color: var(--green);
        margin-right: 5px;
    }

    /* Gạch chân bên dưới */
    &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 0; /* Ban đầu ẩn đi */
        height: 2px;
        background-color: var(--green);
        transition: width 0.3s ease-in-out;
    }

    /* Khi hover hoặc active, đổi màu chữ và hiển thị gạch chân */
    &:hover,
    &.active {
        color: var(--green);
    }

    &:hover::after,
    &.active::after {
        width: 100%; /* Hiển thị gạch chân */
    }
`;

const Header = () => {
    return (
        <HeaderContainer>
            <Logo href='#'>KHANGMOIHOCIT.</Logo>
            <Nav>
                <NavLink
                    to='hero'
                    spy={true}
                    smooth={true}
                    duration={500}
                    activeClass='active'
                >
                    <span>01.</span>HOME
                </NavLink>
                <NavLink
                    to='about'
                    spy={true}
                    smooth={true}
                    duration={500}
                    activeClass='active'
                >
                    <span>02.</span>ABOUT
                </NavLink>
                <NavLink
                    to='resume'
                    spy={true}
                    smooth={true}
                    duration={500}
                    activeClass='active'
                >
                    <span>03.</span>RESUME
                </NavLink>
                <NavLink
                    to='works'
                    spy={true}
                    smooth={true}
                    duration={500}
                    activeClass='active'
                >
                    <span>04.</span>WORKS
                </NavLink>
                <NavLink
                    to='blog'
                    spy={true}
                    smooth={true}
                    duration={500}
                    activeClass='active'
                >
                    <span>05.</span>BLOG
                </NavLink>
                <NavLink
                    to='contact'
                    spy={true}
                    smooth={true}
                    duration={500}
                    activeClass='active'
                >
                    <span>06.</span>CONTACT
                </NavLink>
            </Nav>
            <Button>HIRE ME</Button>
        </HeaderContainer>
    );
};

export default Header;
