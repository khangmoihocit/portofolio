import React, { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Button from '../common/Button';

// SVG Icons as React Components
const IconImage = () => (
    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
        <path d="M2.9918 21C2.44405 21 2 20.5551 2 20.0066V3.9934C2 3.44476 2.45531 3 2.9918 3H21.0082C21.556 3 22 3.44495 22 3.9934V20.0066C22 20.5552 21.5447 21 21.0082 21H2.9918ZM20 15V5H4V19L14 9L20 15ZM20 17.8284L14 11.8284L6.82843 19H20V17.8284ZM8 11C6.89543 11 6 10.1046 6 9C6 7.89543 6.89543 7 8 7C9.10457 7 10 7.89543 10 9C10 10.1046 9.10457 11 8 11Z"></path>
    </svg>
);

const IconExternal = () => (
    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 6V8H5V19H16V14H18V20C18 20.5523 17.5523 21 17 21H4C3.44772 21 3 20.5523 3 20V7C3 6.44772 3.44772 6 4 6H10ZM21 3V11H19L18.9999 6.413L11.2071 14.2071L9.79289 12.7929L17.5849 5H13V3H21Z"></path>
    </svg>
);

const IconPlay = () => (
    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 3.9934C3 3.44476 3.44495 3 3.9934 3H20.0066C20.5552 3 21 3.44495 21 3.9934V20.0066C21 20.5552 20.5551 21 20.0066 21H3.9934C3.44476 21 3 20.5551 3 20.0066V3.9934ZM5 5V19H19V5H5ZM10.6219 8.41459L15.5008 11.6672C15.6846 11.7897 15.7343 12.0381 15.6117 12.2219C15.5824 12.2658 15.5447 12.3035 15.5008 12.3328L10.6219 15.5854C10.4381 15.708 10.1897 15.6583 10.0672 15.4745C10.0234 15.4088 10 15.3316 10 15.2526V8.74741C10 8.52649 10.1791 8.34741 10.4 8.34741C10.479 8.34741 10.5562 8.37078 10.6219 8.41459Z"></path>
    </svg>
);

const portfolioData = [
    {
        id: 1,
        title: 'Candle',
        description: 'Creative Candle Light',
        image: 'https://images.unsplash.com/photo-1602874801006-55c0c76c1fbc?w=550&h=384&fit=crop&crop=center',
        category: 'UI/UX Design',
        hasPreview: true,
        hasExternal: true,
        externalUrl: 'https://dribbble.com'
    },
    {
        id: 2,
        title: 'Paint',
        description: 'Creative wall painting',
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=550&h=384&fit=crop&crop=center',
        category: 'UI/UX Design',
        hasPreview: false,
        hasExternal: true,
        externalUrl: 'https://dribbble.com'
    },
    {
        id: 3,
        title: 'UI/UX Sample',
        description: 'UI/UX Sample design mockup',
        image: 'https://images.unsplash.com/photo-1555421689-491a97ff2040?w=550&h=384&fit=crop&crop=center',
        category: 'UI/UX Design',
        hasPreview: true,
        hasPlay: true,
        hasExternal: true,
        externalUrl: 'https://dribbble.com'
    },
    {
        id: 4,
        title: 'Packet',
        description: 'Packet design mockup',
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=550&h=384&fit=crop&crop=center',
        category: 'HTML & CSS',
        hasPreview: true,
        hasExternal: true,
        externalUrl: 'https://dribbble.com'
    },
    {
        id: 5,
        title: 'Packet',
        description: 'Another packet design mockup',
        image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=550&h=384&fit=crop&crop=center',
        category: 'React JS',
        hasPreview: true,
        hasPlay: true,
        hasExternal: true,
        externalUrl: 'https://dribbble.com'
    },
    {
        id: 6,
        title: 'Cream',
        description: 'Creative cream box design',
        image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=550&h=384&fit=crop&crop=center',
        category: 'Node JS',
        hasPreview: false,
        hasExternal: true,
        externalUrl: 'https://dribbble.com'
    }
];

const filterCategories = ['All', 'HTML & CSS', 'React JS', 'C# .NET', 'Spring boot'];

const PortfolioItem = ({ item, index }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });
    
    return (
        <motion.div
            ref={ref}
            className="portfolio-item"
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: index * 0.1 }}
        >
            <div className="portfolio-card card-tw group">
                <div className="portfolio-top">
                    <div className="portfolio-image">
                        <img 
                            src={item.image} 
                            alt={item.title}
                            loading="lazy"
                        />
                    </div>
                    <div className="portfolio-overlay">
                        {item.hasPreview && (
                            <button className="portfolio-btn" aria-label="Preview">
                                <IconImage />
                            </button>
                        )}
                        {item.hasPlay && (
                            <button className="portfolio-btn" aria-label="Play">
                                <IconPlay />
                            </button>
                        )}
                        {item.hasExternal && (
                            <a 
                                href={item.externalUrl} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="portfolio-btn"
                                aria-label="External Link"
                            >
                                <IconExternal />
                            </a>
                        )}
                    </div>
                </div>
                <div className="portfolio-content">
                    <h5>{item.title}</h5>
                    <p>{item.description}</p>
                </div>
            </div>
        </motion.div>
    );
};

const Portfolio = () => {
    const [activeFilter, setActiveFilter] = useState('All');
    const [visibleItems, setVisibleItems] = useState(6);

    const filteredPortfolio = activeFilter === 'All' 
        ? portfolioData 
        : portfolioData.filter(item => item.category === activeFilter);

    const displayedItems = filteredPortfolio.slice(0, visibleItems);

    const handleFilterChange = (filter) => {
        setActiveFilter(filter);
        setVisibleItems(6); // Reset visible items when filter changes
    };

    const handleLoadMore = () => {
        setVisibleItems(prev => prev + 3);
    };

    return (
        <section className="portfolio-section" id="portfolio">
            <div className="container-tw">
                <div className="section-heading">
                    <h2 className="title">My Works</h2>
                    <div className="title-anim">
                        <span></span>
                    </div>
                    <span className="bg-title" aria-hidden="true">
                        Works
                    </span>
                </div>
                
                <div className="portfolio-filters">
                    {filterCategories.map((category) => (
                        <Button
                            key={category}
                            variant={activeFilter === category ? 'primary' : 'outline'}
                            size="small"
                            onClick={() => handleFilterChange(category)}
                            className="portfolio-filter-btn"
                        >
                            {category}
                        </Button>
                    ))}
                </div>
                
                <div className="portfolio-grid">
                    {displayedItems.map((item, index) => (
                        <PortfolioItem
                            key={`${activeFilter}-${item.id}`}
                            item={item}
                            index={index}
                        />
                    ))}
                </div>
                
                {displayedItems.length < filteredPortfolio.length && (
                    <div className="portfolio-load-more">
                        <Button 
                            variant="primary" 
                            size="small"
                            onClick={handleLoadMore}
                        >
                            Load More
                        </Button>
                    </div>
                )}
            </div>
        </section>
    );
};

export default Portfolio;