import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import '../../styles/components/_services.scss';
import Heading from '../common/Heading';

// SVG Icons as React Components
const IconPen = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor">
        <path d="M6.94 14.036c-.233.624-.43 1.2-.606 1.783.96-.697 2.101-1.139 3.418-1.304 2.513-.314 4.746-1.973 5.876-4.058l-1.456-1.455 1.413-1.415 1-1.001c.43-.43.915-1.224 1.428-2.368-5.593.867-9.018 4.292-11.074 9.818zM17 9.001L18 10c-1 3-4 6-8 6.5-2.669.334-4.336 2.167-5.002 5.5H3C4 16 6 2 21 2c-1 2.997-1.998 4.996-2.997 5.997L17 9.001z" />
    </svg>
);
const IconCode = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor">
        <path d="M24 12l-5.657 5.657-1.414-1.414L21.172 12l-4.243-4.243 1.414-1.414L24 12zM2.828 12l4.243 4.243-1.414 1.414L0 12l5.657-5.657L7.07 7.757 2.828 12zm6.96 9H7.66l6.552-18h2.128L9.788 21z" />
    </svg>
);
const IconMobile = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor">
        <path d="M7 4v16h10V4H7zM6 2h12a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1zm6 15a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
    </svg>
);

const servicesData = [
    {
        icon: <IconPen />,
        title: 'Ui/Ux Design',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Augue diam etiam venenatis mi tristique amet cras diam etiam.',
        number: '01',
    },
    {
        icon: <IconCode />,
        title: 'Web Development',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Augue diam etiam venenatis mi tristique amet cras diam etiam.',
        number: '02',
    },
    {
        icon: <IconMobile />,
        title: 'Mobile App Development',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Augue diam etiam venenatis mi tristique amet cras diam etiam.',
        number: '03',
    },
];

const ServiceItem = ({ icon, title, description, number, index }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });
    
    return (
        <motion.div
            ref={ref}
            className="service-item"
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: index * 0.2 }}
        >
            <div className="service-content">
                <span className="service-icon">{icon}</span>
                <div className="service-details">
                    <h5>{title}</h5>
                    <p>{description}</p>
                </div>
            </div>
            <span className="service-number">{number}</span>
        </motion.div>
    );
};

const Services = () => {
    const { t } = useTranslation();
    
    const servicesData = [
        {
            icon: <IconPen />,
            title: t('services.uiDesign'),
            description: t('services.uiDesc'),
            number: '01',
        },
        {
            icon: <IconCode />,
            title: t('services.webDev'),
            description: t('services.webDesc'),
            number: '02',
        },
        {
            icon: <IconMobile />,
            title: t('services.mobileDev'),
            description: t('services.mobileDesc'),
            number: '03',
        },
    ];

    return (
        <section className="services-section" id="services">
            <div className="container">
                <Heading title={t('services.title')} bgTitle={t('services.bgTitle')}/>
                <div className="services-wrapper">
                    {servicesData.map((service, index) => (
                        <ServiceItem
                            key={service.number}
                            icon={service.icon}
                            title={service.title}
                            description={service.description}
                            number={service.number}
                            index={index}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Services;

