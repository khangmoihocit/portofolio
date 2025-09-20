import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

// SVG Icons as React Components
const IconEducation = () => (
    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 18.5V5C3 3.34315 4.34315 2 6 2H20C20.5523 2 21 2.44772 21 3V21C21 21.5523 20.5523 22 20 22H6.5C4.567 22 3 20.433 3 18.5ZM19 20V17H6.5C5.67157 17 5 17.6716 5 18.5C5 19.3284 5.67157 20 6.5 20H19ZM5 15.3368C5.45463 15.1208 5.9632 15 6.5 15H19V4H6C5.44772 4 5 4.44772 5 5V15.3368Z"></path>
    </svg>
);

const IconWork = () => (
    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
        <path d="M7 5V2C7 1.44772 7.44772 1 8 1H16C16.5523 1 17 1.44772 17 2V5H21C21.5523 5 22 5.44772 22 6V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V6C2 5.44772 2.44772 5 3 5H7ZM4 16V19H20V16H4ZM4 14H20V7H4V14ZM9 3V5H15V3H9ZM11 11H13V13H11V11Z"></path>
    </svg>
);

// Education data
const educationData = [
    {
        id: 1,
        period: '2023 - 2026',
        title: 'Higher School Graduation',
        institution: 'HaNoi Open University.',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed consectetur donec gravida ullamcorper cum id. Sit viverra donec in ornare euismod.'
    },
    {
        id: 2,
        period: '2023 - 2028',
        title: 'Bachelor of Sciences',
        institution: 'HaNoi Open University.',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed consectetur donec gravida ullamcorper cum id. Sit viverra donec in ornare euismod.'
    },
    {
        id: 3,
        period: '0 - 0',
        title: 'Masters of Sciences',
        institution: 'University.',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed consectetur donec gravida ullamcorper cum id. Sit viverra donec in ornare euismod.'
    }
];

// Experience data
const experienceData = [
    {
        id: 1,
        period: '0 - 0',
        title: 'Cloud',
        company: 'Company x.',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed consectetur donec gravida ullamcorper cum id. Sit viverra donec in ornare euismod.'
    },
    {
        id: 2,
        period: '0 - 0',
        title: 'Front-end Developer',
        company: 'Company x.',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed consectetur donec gravida ullamcorper cum id. Sit viverra donec in ornare euismod.'
    },
    {
        id: 3,
        period: '0 - 0',
        title: 'Back-end Developer',
        company: 'Company x.',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed consectetur donec gravida ullamcorper cum id. Sit viverra donec in ornare euismod.'
    }
];

const TimelineItem = ({ item, index, isLast }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-50px' });
    
    return (
        <motion.div
            ref={ref}
            className="timeline-item"
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: index * 0.2 }}
        >
            <div className="timeline-content">
                <span className="timeline-period">{item.period}</span>
                <div className="timeline-details">
                    <div className="timeline-line">
                        <span className="timeline-dot"></span>
                        <span className="timeline-connector"></span>
                    </div>
                    <h5 className="timeline-title">{item.title}</h5>
                    <p className="timeline-institution">{item.institution || item.company}</p>
                    <p className="timeline-description">{item.description}</p>
                </div>
            </div>
        </motion.div>
    );
};

const Resume = () => {
    return (
        <section className="resume-section" id="resume">
            <div className="container-tw">
                <div className="section-heading">
                    <h2 className="title">My Resume</h2>
                    <div className="title-anim">
                        <span></span>
                    </div>
                    <span className="bg-title" aria-hidden="true">
                        Resume
                    </span>
                </div>
                
                <div className="resume-content">
                    {/* Education Section */}
                    <div className="resume-column">
                        <div className="resume-category">
                            <h4 className="category-title">
                                <IconEducation />
                                Educational Qualification
                            </h4>
                            <div className="timeline">
                                {educationData.map((item, index) => (
                                    <TimelineItem
                                        key={item.id}
                                        item={item}
                                        index={index}
                                        isLast={index === educationData.length - 1}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                    
                    {/* Experience Section */}
                    <div className="resume-column">
                        <div className="resume-category">
                            <h4 className="category-title">
                                <IconWork />
                                Working Experience
                            </h4>
                            <div className="timeline">
                                {experienceData.map((item, index) => (
                                    <TimelineItem
                                        key={item.id}
                                        item={item}
                                        index={index}
                                        isLast={index === experienceData.length - 1}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Resume;