import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import Button from '../common/Button';

const Contact = () => {
    const { t } = useTranslation();
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
        setMessage(t('contact.form.devMessage'));
        setTimeout(() => {
            setMessage('');
        }, 5000);
    };

    const contactInfo = [
        {
            icon: FaPhone,
            title: t('contact.phone'),
            details: ['+012-3456-7891', '+012-3456-7892'],
            links: ['tel:+01234567891', 'tel:+01234567892']
        },
        {
            icon: FaEnvelope,
            title: t('contact.email'),
            details: ['khangphamvan.dev@gmail.com'],
            links: [
                'mailto:khangphamvan.dev@gmail.com'
            ]
        },
        {
            icon: FaMapMarkerAlt,
            title: t('contact.address'),
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
                        {t('contact.title')}
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
                    <span className='contact__title-bg'>{t('contact.bgTitle')}</span>
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
                            {t('contact.contactInfo')}
                        </h4>
                        <p className='contact__info-description'>
                            {t('contact.contactDesc')}
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
                                    {t('contact.form.name')}
                                </label>
                                <input
                                    type='text'
                                    id='name'
                                    name='name'
                                    placeholder={t('contact.form.namePlaceholder')}
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
                                    {t('contact.form.email')}
                                </label>
                                <input
                                    type='email'
                                    id='email'
                                    name='email'
                                    placeholder={t('contact.form.emailPlaceholder')}
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
                                    {t('contact.form.subject')}
                                </label>
                                <input
                                    type='text'
                                    id='subject'
                                    name='subject'
                                    placeholder={t('contact.form.subjectPlaceholder')}
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
                                    {t('contact.form.message')}
                                </label>
                                <textarea
                                    id='message'
                                    name='message'
                                    rows='5'
                                    placeholder={t('contact.form.messagePlaceholder')}
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
                                {t('contact.form.sendMail')}
                            </Button>
                        </form>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Contact;
