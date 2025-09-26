// src/components/About/About.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import profilePic from '../../assets/images/unnamed.jpg';
import Button from '../common/Button';
import '../../styles/components/_about.scss';

const About = () => {
  const { t } = useTranslation();
  
  const personalInfo = [
    { label: t('about.personalInfo.firstName'), value: t('about.personalData.firstName') },
    { label: t('about.personalInfo.fullName'), value: t('about.personalData.fullName') },
    { label: t('about.personalInfo.age'), value: t('about.personalData.age') },
    { label: t('about.personalInfo.nationality'), value: t('about.personalData.nationality') },
    { label: t('about.personalInfo.languages'), value: t('about.personalData.languages') },
    { label: t('about.personalInfo.address'), value: t('about.personalData.address') },
    { label: t('about.personalInfo.freelance'), value: t('about.personalData.freelance') }
  ];

  return (
    <section className="about-section" id="about">
      <div className="container">
        <div className="section-heading">
          <h2 className="title">{t('about.title')}</h2>
          <span className="title-anim">
            <span></span>
          </span>
          <span className="bg-title">{t('about.bgTitle')}</span>
        </div>
        <div className="grid">
          <div className="col-span-2 lg:col-span-1">
            <div className="about-image">
              <div className="about-image-inner">
                <span className="top-span"></span>
                <span className="bottom-span"></span>
                <span className="left-span"></span>
                <span className="right-span"></span>
                <img src={profilePic} alt="Khang MoiHocIT" />
              </div>
            </div>
          </div>
          <div className="col-span-2 lg:col-span-1">
            <div className="about-content">
              <h3>
                {t('about.greeting')} <span className="text-primary">{t('about.name')}</span>
              </h3>
              <ul className="styledlist">
                {personalInfo.map((info, index) => (
                  <li key={index}>
                    <strong>{info.label}</strong>: {info.value}
                  </li>
                ))}
              </ul>
              <Button className="btn" variant="secondary">
                <span>{t('about.downloadResume')}</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;