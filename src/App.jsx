import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage/HomePage';
import BlogPage from './pages/BlogPage/BlogPage';
import AILearningPage from './pages/BlogPage/AILearningPage';

function App() {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path='/' element={<HomePage />} />
                    <Route path='/blog/ai-learning' element={<AILearningPage />} />
                    <Route path='/blog/:id' element={<BlogPage />} />
                    <Route path='/blog' element={<BlogPage id={1} />} />
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default App;
