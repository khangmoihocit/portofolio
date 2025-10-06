import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, LanguageProvider } from './contexts';
import HomePage from './pages/HomePage/HomePage';
import BlogPage from './pages/BlogPage/BlogPage';
import PracticePage from './pages/PracticePage/PracticePage.jsx';

function App() {
    return (
        <ThemeProvider>
            <LanguageProvider>
                <BrowserRouter>
                    <Routes>
                        <Route path='/' element={<HomePage />} />
                        <Route path='/practice' element={<PracticePage />} />
                        <Route path='/blog/:id' element={<BlogPage />} />
                        <Route path='/blog' element={<BlogPage id={1} />} />
                    </Routes>
                </BrowserRouter>
            </LanguageProvider>
        </ThemeProvider>
    );
}

export default App;
