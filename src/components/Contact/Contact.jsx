import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import Button from '../common/Button';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const [message, setMessage] = useState('');

    const handleInputChange = e => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = e => {
        e.preventDefault();
        setMessage(
            'This feature is currently under development. Please come back and try again later.'
        );
        setTimeout(() => {
            setMessage('');
        }, 5000);
        // Handle form submission logic here
    };

    const contactInfo = [
        {
            icon: FaPhone,
            title: 'Contact on phone',
            details: ['+012-3456-7891', '+012-3456-7892'],
            links: ['tel:+01234567891', 'tel:+01234567892']
        },
        {
            icon: FaEnvelope,
            title: 'Contact on mail',
            details: ['khang567.ht@gmail.com', 'khangphamvan.dev@gmail.com'],
            links: [
                'mailto:khang567.ht@gmail.com',
                'mailto:khangphamvan.dev@gmail.com'
            ]
        },
        {
            icon: FaMapMarkerAlt,
            title: 'Contact address',
            details: ['ToaA6, TranThuDo, HoangMai, HaNoi, VietNam'],
            links: ['#']
        }
    ];

    return (
        <section className='contact' id='contact'>
            <div className='contact__container'>
                {/* Section Heading */}
                <div className='contact__heading'>
                    <motion.h2
                        className='contact__title'
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        Contact Us
                    </motion.h2>
                    <motion.div
                        className='contact__title-underline'
                        initial={{ width: 0 }}
                        whileInView={{ width: '8rem' }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        viewport={{ once: true }}
                    >
                        <span className='contact__title-underline__animation'></span>
                    </motion.div>
                    <span className='contact__title-bg'>Contact</span>
                </div>

                <div className='contact__content'>
                    {/* Contact Information */}
                    <motion.div
                        className='contact__info'
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <h4 className='contact__info-title'>
                            Contact Information
                        </h4>
                        <p className='contact__info-description'>
                            Lorem ipsum dolor sit amet consectetur adipisicing
                            elit. A omnis, iusto harum possimus non praesentium
                            qui facere.
                        </p>
                        <span className='contact__info-divider'></span>

                        <div className='contact__blocks'>
                            {contactInfo.map((item, index) => (
                                <motion.div
                                    key={index}
                                    className='contact__block'
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{
                                        duration: 0.6,
                                        delay: index * 0.1
                                    }}
                                    viewport={{ once: true }}
                                >
                                    <span className='contact__block-icon'>
                                        <item.icon />
                                    </span>
                                    <div className='contact__block-content'>
                                        <h5 className='contact__block-title'>
                                            {item.title}
                                        </h5>
                                        {item.details.map((detail, idx) => (
                                            <p
                                                key={idx}
                                                className='contact__block-detail'
                                            >
                                                {item.links[idx] !== '#' ? (
                                                    <a
                                                        href={item.links[idx]}
                                                        className='contact__block-link'
                                                    >
                                                        {detail}
                                                    </a>
                                                ) : (
                                                    detail
                                                )}
                                            </p>
                                        ))}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Contact Form */}
                    <motion.div
                        className='contact__form-wrapper'
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <form className='contact__form' onSubmit={handleSubmit}>
                            <div className='contact__form-group'>
                                {message && (
                                    <span className='contact__message'>
                                        {message}
                                    </span>
                                )}
                                <label
                                    htmlFor='name'
                                    className='contact__form-label'
                                >
                                    Name
                                </label>
                                <input
                                    type='text'
                                    id='name'
                                    name='name'
                                    placeholder='Enter your name...'
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className='contact__form-input'
                                    required
                                />
                            </div>

                            <div className='contact__form-group'>
                                <label
                                    htmlFor='email'
                                    className='contact__form-label'
                                >
                                    Email
                                </label>
                                <input
                                    type='email'
                                    id='email'
                                    name='email'
                                    placeholder='Enter your email...'
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className='contact__form-input'
                                    required
                                />
                            </div>

                            <div className='contact__form-group'>
                                <label
                                    htmlFor='subject'
                                    className='contact__form-label'
                                >
                                    Subject
                                </label>
                                <input
                                    type='text'
                                    id='subject'
                                    name='subject'
                                    placeholder='Enter subject...'
                                    value={formData.subject}
                                    onChange={handleInputChange}
                                    className='contact__form-input'
                                    required
                                />
                            </div>

                            <div className='contact__form-group'>
                                <label
                                    htmlFor='message'
                                    className='contact__form-label'
                                >
                                    Message
                                </label>
                                <textarea
                                    id='message'
                                    name='message'
                                    rows='5'
                                    placeholder='Enter your message...'
                                    value={formData.message}
                                    onChange={handleInputChange}
                                    className='contact__form-textarea'
                                    required
                                ></textarea>
                            </div>

                            <Button
                                type='submit'
                                className='contact__form-submit'
                            >
                                Send Mail
                            </Button>
                        </form>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Contact;
