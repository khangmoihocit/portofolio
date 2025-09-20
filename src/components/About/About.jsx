// src/components/About/About.jsx
import React from 'react';
import profilePic from '../../assets/images/unnamed.jpg';
import Button from '../common/Button';
import '../../styles/components/_about.scss';

const About = () => {
  const personalInfo = [
    { label: 'First Name', value: 'Khang' },
    { label: 'Full Name', value: 'Phạm Văn Khang' },
    { label: 'Age', value: '20 years' },
    { label: 'Nationality', value: 'Vietnamese' },
    { label: 'Languages', value: 'Vietnamese, English' },
    { label: 'Address', value: 'MyDuc, Hanoi, Vietnam' },
    { label: 'Freelance', value: 'Available' }
  ];

  return (
    <section className="about-section" id="about">
      <div className="container">
        <div className="section-heading">
          <h2 className="title">About Me</h2>
          <span className="title-anim">
            <span></span>
          </span>
          <span className="bg-title">About</span>
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
                Hi, I am <span className="text-primary">Khang</span>
              </h3>
              <ul className="styledlist">
                {personalInfo.map((info, index) => (
                  <li key={index}>
                    <strong>{info.label}</strong>: {info.value}
                  </li>
                ))}
              </ul>
              <Button className="btn" variant="secondary">
                <span>Download Resume</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;