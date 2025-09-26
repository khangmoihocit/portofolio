import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './styles.module.scss';
import LogoVN from '../../../assets/svgs/vn.svg';
import LogoENG from '../../../assets/svgs/eng.svg';
import LogoJP from '../../../assets/svgs/japan.svg';

const MenuLanguage = () => {
    const { i18n } = useTranslation();
    const {
        boxLanguage,
        menuLanguage,
        containerLanguage,
        wrapLanguage,
        boxLanguage1
    } = styles;

    const [isShowLanguage, setIsShowLanguage] = useState(false);
    const [typeLanguage, setTypeLanguage] = useState(i18n.language || 'en');
    const [language, setLanguage] = useState({ src: LogoENG, content: 'ENG' });

    const dataLanguage = [
        { content: 'Vietnamese (vi-VN)', src: LogoVN, value: 'vi' },
        { content: 'English (en-US)', src: LogoENG, value: 'en' },
        { content: 'Japanese (ja-JP)', src: LogoJP, value: 'ja' }
    ];

    // Đồng bộ ngôn ngữ hiện tại khi component mount
    useEffect(() => {
        setTypeLanguage(i18n.language || 'en');
    }, [i18n.language]);

    useEffect(() => {
        switch (typeLanguage) {
            case 'vi':
                setLanguage({ src: LogoVN, content: 'VN' });
                break;
            case 'en':
                setLanguage({ src: LogoENG, content: 'ENG' });
                break;
            case 'ja':
                setLanguage({ src: LogoJP, content: 'JP' });
                break;
            default:
                setLanguage({ src: LogoENG, content: 'ENG' });
        }
    }, [typeLanguage]);

    return (
        <div
            className={containerLanguage}
            onMouseEnter={() => setIsShowLanguage(!isShowLanguage)}
            onMouseLeave={() => setIsShowLanguage(!isShowLanguage)}
        >
            <div className={boxLanguage}>
                <img src={language.src} alt='icon vn' />
                <p>{language.content}</p>
            </div>
            {isShowLanguage && (
                <div className={menuLanguage}>
                    <b>Languages</b>
                    <div className={wrapLanguage}>
                        {dataLanguage.map((item, index) => (
                            <div
                                key={index}
                                onClick={() => {
                                    setTypeLanguage(item.value);
                                    i18n.changeLanguage(item.value);
                                    setIsShowLanguage(false);
                                }}
                                className={boxLanguage1}
                            >
                                <img src={item.src} alt={item.content} />
                                <p>{item.content}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MenuLanguage;
