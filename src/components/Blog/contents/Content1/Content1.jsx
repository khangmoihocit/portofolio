import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { FaCalendar, FaTag, FaArrowLeft } from 'react-icons/fa';
import styles from './styles.module.scss';
import blogImage from '../../../../assets/images/portfolio.png';

const Content1 = () => {
    const { t } = useTranslation();

    return (
        <article className={styles.blogContent}>
            {/* Back button */}
            <div className={styles.backButton}>
                <Link to="/#blog" className={styles.backLink}>
                    <FaArrowLeft />
                    <span>{t('blog.backToList') || 'Back to Blog List'}</span>
                </Link>
            </div>

            {/* Article Header */}
            <header className={styles.articleHeader}>
                <h1 className={styles.title}>
                    {t('blog.posts.post1.title') || 'Building a Modern Portfolio Website'}
                </h1>
                
                <div className={styles.meta}>
                    <span className={styles.metaItem}>
                        <FaCalendar />
                        <time dateTime="2024-01-15">January 15, 2024</time>
                    </span>
                    <span className={styles.metaItem}>
                        <FaTag />
                        <span>{t('blog.posts.post1.category') || 'Web Development'}</span>
                    </span>
                </div>
            </header>

            {/* Featured Image */}
            <div className={styles.featuredImage}>
                <img src={blogImage} alt="Portfolio Website" />
            </div>

            {/* Article Content */}
            <div className={styles.articleBody}>
                <section className={styles.section}>
                    <h2>Introduction</h2>
                    <p>
                        In this article, I'll walk you through the process of building a modern, 
                        responsive portfolio website using React, Vite, and Tailwind CSS. This project 
                        showcases best practices in web development and demonstrates how to create 
                        a professional online presence.
                    </p>
                </section>

                <section className={styles.section}>
                    <h2>Key Features</h2>
                    <ul>
                        <li>
                            <strong>Responsive Design:</strong> The website adapts seamlessly to all 
                            screen sizes, from mobile phones to large desktop monitors.
                        </li>
                        <li>
                            <strong>Multi-language Support:</strong> Built-in internationalization (i18n) 
                            supporting English, Japanese, and Vietnamese.
                        </li>
                        <li>
                            <strong>Smooth Animations:</strong> Leveraging Framer Motion for elegant 
                            page transitions and interactive elements.
                        </li>
                        <li>
                            <strong>AI Chatbot Integration:</strong> An intelligent chatbot powered by 
                            Google's Generative AI to answer visitor questions.
                        </li>
                        <li>
                            <strong>Dark/Light Theme:</strong> User-friendly theme switching with 
                            persistent preferences.
                        </li>
                    </ul>
                </section>

                <section className={styles.section}>
                    <h2>Technology Stack</h2>
                    <p>
                        The portfolio is built using modern web technologies:
                    </p>
                    <ul>
                        <li><strong>React 18:</strong> For building the user interface with hooks and functional components</li>
                        <li><strong>Vite:</strong> Lightning-fast build tool and development server</li>
                        <li><strong>Tailwind CSS:</strong> Utility-first CSS framework for rapid styling</li>
                        <li><strong>SCSS/Sass:</strong> For advanced CSS features and better organization</li>
                        <li><strong>Framer Motion:</strong> For smooth, professional animations</li>
                        <li><strong>i18next:</strong> Internationalization framework for multi-language support</li>
                    </ul>
                </section>

                <section className={styles.section}>
                    <h2>Development Process</h2>
                    <h3>1. Project Setup</h3>
                    <p>
                        I started by setting up the project with Vite, which provides a much faster 
                        development experience compared to traditional Create React App. The hot module 
                        replacement (HMR) is incredibly fast, making development a breeze.
                    </p>
                    
                    <h3>2. Component Architecture</h3>
                    <p>
                        The application is organized into reusable components, each with its own 
                        responsibility:
                    </p>
                    <ul>
                        <li>Layout components (Header, Footer)</li>
                        <li>Section components (Hero, About, Portfolio, Skills, Resume, Contact)</li>
                        <li>Common components (Button, Heading, Theme switcher, etc.)</li>
                    </ul>

                    <h3>3. Styling Approach</h3>
                    <p>
                        I combined Tailwind CSS for utility classes with SCSS modules for component-specific 
                        styling. This hybrid approach gives the best of both worlds: rapid development with 
                        utilities and fine-grained control with custom styles.
                    </p>
                </section>

                <section className={styles.section}>
                    <h2>Challenges and Solutions</h2>
                    <h3>Performance Optimization</h3>
                    <p>
                        One challenge was ensuring fast load times. I implemented lazy loading for images, 
                        code splitting for routes, and optimized bundle sizes. The result is a website that 
                        loads quickly even on slower connections.
                    </p>

                    <h3>Multi-language Support</h3>
                    <p>
                        Implementing i18n required careful planning. I structured translation files logically 
                        and ensured all dynamic content could be translated. The language switcher persists 
                        user preferences using localStorage.
                    </p>
                </section>

                <section className={styles.section}>
                    <h2>Results and Learnings</h2>
                    <p>
                        This project taught me valuable lessons about modern web development:
                    </p>
                    <ul>
                        <li>The importance of component reusability and maintainability</li>
                        <li>How to effectively use modern CSS frameworks</li>
                        <li>Best practices for React hooks and state management</li>
                        <li>Techniques for optimizing web performance</li>
                        <li>How to integrate third-party APIs effectively</li>
                    </ul>
                </section>

                <section className={styles.section}>
                    <h2>Conclusion</h2>
                    <p>
                        Building this portfolio was an excellent learning experience. It showcases not just 
                        my technical skills, but also my attention to detail and commitment to creating 
                        quality user experiences. The website serves as both a demonstration of my 
                        capabilities and a platform to share my journey in web development.
                    </p>
                    <p>
                        Feel free to explore the live site and check out the source code on GitHub. 
                        If you have any questions or would like to discuss this project further, 
                        don't hesitate to reach out!
                    </p>
                </section>
            </div>

            {/* Article Footer */}
            <footer className={styles.articleFooter}>
                <div className={styles.backButton}>
                    <Link to="/" className={styles.backLink}>
                        <FaArrowLeft />
                        <span>{t('blog.backToList') || 'Back to Blog List'}</span>
                    </Link>
                </div>
            </footer>
        </article>
    );
};

export default Content1;