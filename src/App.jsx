import React from 'react';
import Header from './components/Header/Header';
import Hero from './components/Hero/Hero';
import About from './components/About/About';
import Skills from './components/Skills/Skills';
import Services from './components/Services/Services';
import Portfolio from './components/Portfolio/Portfolio';
import Resume from './components/Resume/Resume';
import Contact from './components/Contact/Contact';
import Footer from './components/Footer/Footer';
import FloatingActionMenu from './components/common/FloatingActionMenu';
import ScrollToTopButton from './components/common/ScrollToTopButton';

function App() {
    return (
        <>
            <Header />
            <main className='main-container'>
                <Hero />
                <About />
                <Skills />
                <Services />
                <Resume />
                <Portfolio />
                <Contact />
            </main>
            <Footer />
            <FloatingActionMenu />
            <ScrollToTopButton />
        </>
    );
}

export default App;
