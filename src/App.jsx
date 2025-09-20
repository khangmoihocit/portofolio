// src/App.jsx
import React from 'react';
import styled from 'styled-components';
import GlobalStyle from './styles/GlobalStyle';
import Header from './components/Header/Header';
import Hero from './components/Hero/Hero';
// Import các component khác ở đây khi bạn tạo chúng
// import About from './components/About/About';
// import Services from './components/Services/Services';
// import Portfolio from './components/Portfolio/Portfolio';
// import Contact from './components/Contact/Contact';
// import Footer from './components/Footer/Footer';

const MainContainer = styled.div`
  padding: 0 10%;
`;

function App() {
  return (
    <>
      <GlobalStyle />
      <Header />
      <MainContainer>
        <Hero />
        {/* <About /> */}
        {/* <Services /> */}
        {/* <Portfolio /> */}
        {/* <Contact /> */}
      </MainContainer>
      {/* <Footer /> */}
    </>
  );
}

export default App;