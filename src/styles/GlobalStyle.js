// src/styles/GlobalStyle.js
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  :root {
    --navy: #0F172A; /* Nền tối */
    --light-slate: #BFBECB; /* Màu chữ phụ */
    --slate: #a0a0a0;
    --white: #E6F1FF; /* Màu chữ chính */
    --green: #72E2AE; /* Màu accent */
  }

  *,
  *::before,
  *::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Radio Canada', sans-serif;
    background-color: var(--navy);
    color: var(--slate);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  h1, h2, h3, h4, h5, h6 {
    color: var(--white);
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  ul {
    list-style: none;
  }

  button {
    cursor: pointer;
    border: none;
    background: none;
  }
`;

export default GlobalStyle;