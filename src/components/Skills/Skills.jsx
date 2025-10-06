import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import '../../styles/components/_skills.scss';
import Heading from '../common/Heading';

const CircularSkill = ({ name, percentage }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });
    const radius = 54;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
        <motion.div 
            className="circleprogress card hovercard"
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
        >
            <div className="circle-container">
                <svg className="circle" width="120" height="120" viewBox="0 0 120 120">
                    <circle className="circlebg" cx="60" cy="60" r={radius} strokeWidth="12" />
                    <circle 
                        className="circle-progress" 
                        cx="60" 
                        cy="60" 
                        r={radius} 
                        strokeWidth="12"
                        style={{
                           strokeDashoffset: isInView ? strokeDashoffset : circumference,
                        }}
                    />
                </svg>
                <span className="percentage-text">{percentage}%</span>
            </div>
            <h5>{name}</h5>
        </motion.div>
    );
};

const LinearSkill = ({ name, percentage }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });

    return(
        <motion.div 
            className="progress"
            ref={ref}
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
        >
            <h5>{name} - <span>({percentage}%)</span></h5>
            <div className="progress-bar">
                {isInView && (
                    <span 
                        className="progress-progress" 
                        style={{ width: `${percentage}%` }}
                    ></span>
                )}
            </div>
        </motion.div>
    )
};

const Skills = () => {
    const { t } = useTranslation();
    
    const circularSkillsData = [
        { name: t('skills.circular.database'), percentage: 60 },
        { name: t('skills.circular.backend'), percentage: 75 },
        { name: t('skills.circular.frontend'), percentage: 70 },
        { name: t('skills.circular.mobile'), percentage: 50 },
    ];

    const linearSkillsData = [
        { name: 'Javascript', percentage: 65 },
        { name: 'ASP.NET', percentage: 55},
        { name: 'React Js', percentage: 60 },
        { name: 'Java', percentage: 70 },
        { name: 'Html & Css', percentage: 65 },
        { name: 'Spring Framework', percentage: 75 },
        { name: 'Postman', percentage: 70 },
        { name: 'AI', percentage: 50 },
    ];

    return (
        <section className="skills-section" id="skills">
            <div className="container">
                <Heading title={t('skills.title')} bgTitle={t('skills.bgTitle')}/>
                <div className="skills-wrapper">
                    <div className="grid grid-cols-4">
                        {circularSkillsData.map((skill, index) => (
                            <div key={index} className="col-span-1" >
                                <CircularSkill name={skill.name} percentage={skill.percentage} />
                            </div>
                        ))}
                    </div>
                    <div className="py-7"></div>
                    <div className="grid grid-cols-2" style={{display:'flex', justifyContent:'space-between', flexWrap:'wrap'}}>
                         {linearSkillsData.map((skill, index) => (
                            <div key={index} className="col-span-1" style={{width: '48%'}}>
                                <LinearSkill name={skill.name} percentage={skill.percentage} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Skills;