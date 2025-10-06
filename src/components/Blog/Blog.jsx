import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useBreakpoint } from '../../hooks/useTailwindUtilities';
import '../../styles/components/_blog.scss';
import blogImage1 from '../../assets/images/portfolio.png';
import blogImage2 from '../../assets/images/minimart.png';
import blogImage3 from '../../assets/images/ecommerce.png';
import blogImage4 from '../../assets/images/bookstore.png';
import blogImage5 from '../../assets/images/unnamed.jpg';
import Heading from '../common/Heading';


const BlogItem = ({ post }) => {
    return (
        <article className='blog-item'>
            <div className='blog-item__top'>
                <Link to={`/blog/${post.id}`} className='blog-item__image-link'>
                    <img src={post.image} alt={post.title} loading='lazy' />
                </Link>
                <div className='blog-item__date'>
                    <span className='month'>{post.month}</span>
                    <span className='date'>{post.day}</span>
                    <span className='year'>{post.year}</span>
                </div>
            </div>
            <h5 className='blog-item__title'>
                <Link to={`/blog/${post.id}`}>{post.title}</Link>
            </h5>
            <div className='blog-item__category'>
                <span>
                    <Link to={`/blog/${post.id}`}>{post.category}</Link>
                </span>
            </div>
        </article>
    );
};

const Blog = () => {
    const { t } = useTranslation();
    const { isMobile, isTablet } = useBreakpoint();
    const [currentIndex, setCurrentIndex] = useState(0);
    

    const blogPosts = [
        { id: 1, image: blogImage1, day: '15', year: '2024', ...t('blog.posts.post1', { returnObjects: true }) },
        { id: 2, image: blogImage2, day: '22', year: '2024', ...t('blog.posts.post2', { returnObjects: true }) },
        { id: 3, image: blogImage3, day: '30', year: '2024', ...t('blog.posts.post3', { returnObjects: true }) },
        { id: 4, image: blogImage4, day: '05', year: '2024', ...t('blog.posts.post4', { returnObjects: true }) },
        { id: 5, image: blogImage5, day: '12', year: '2024', ...t('blog.posts.post5', { returnObjects: true }) },
    ];
    
    const postsToShow = isMobile ? 1 : isTablet ? 2 : 3;
    const canGoPrev = currentIndex > 0;
    const canGoNext = currentIndex < blogPosts.length - postsToShow;

    const handlePrev = () => {
        setCurrentIndex(prev => Math.max(0, prev - 1));
    };

    const handleNext = () => {
        setCurrentIndex(prev => Math.min(blogPosts.length - postsToShow, prev + 1));
    };

    useEffect(() => {
        if (currentIndex > blogPosts.length - postsToShow) {
            setCurrentIndex(Math.max(0, blogPosts.length - postsToShow));
        }
    }, [isMobile, isTablet, postsToShow, blogPosts.length, currentIndex]);
    
    return (
        <section className='blog-section' id='blog'>
            <div className='container'>
                <Heading title={t('blog.title')} bgTitle={t('blog.bgTitle')}/>
                
                <div className="blog-slider">
                    <motion.div
                        className='blog-slider__wrapper'
                        animate={{ x: `-${currentIndex * (100 / postsToShow)}%` }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    >
                        {blogPosts.map((post) => (
                           <div className='blog-slider__slide' key={post.id}>
                               <BlogItem post={post} />
                           </div>
                        ))}
                    </motion.div>

                    {blogPosts.length > postsToShow && (
                        <>
                            <button 
                                className="blog-slider__nav blog-slider__nav--prev" 
                                onClick={handlePrev} 
                                disabled={!canGoPrev}
                                aria-label="Previous blog post"
                            >
                                <FaChevronLeft />
                            </button>
                            <button 
                                className="blog-slider__nav blog-slider__nav--next" 
                                onClick={handleNext} 
                                disabled={!canGoNext}
                                aria-label="Next blog post"
                            >
                                <FaChevronRight />
                            </button>
                        </>
                    )}
                </div>
            </div>
        </section>
    );
};

export default Blog;