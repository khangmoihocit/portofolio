import React, { useEffect, useState } from 'react';
import styles from './styles.module.scss';
import LogoVN from '../../../assets/svgs/vn.svg';
import LogoENG from '../../../assets/svgs/eng.svg';
import LogoJP from '../../../assets/svgs/japan.svg';

const MenuLanguage = () => {
    const {
        boxLanguage,
        menuLanguage,
        containerLanguage,
        wrapLanguage,
        boxLanguage1
    } = styles;

    const [isShowLanguage, setIsShowLanguage] = useState(false);
    const [typeLanguage, setTypeLanguage] = useState('ENG');
    const [language, setLanguage] = useState({ src: LogoENG, content: 'ENG' });

    const dataLanguage = [
        { content: 'Vietnamese (vi-VN', src: LogoVN, value: 'VN' },
        { content: 'English (en-US)', src: LogoENG, value: 'ENG' },
        { content: 'Japanese (ja-JP)', src: LogoJP, value: 'JP' }
    ];

    useEffect(() => {
        switch (typeLanguage) {
            case 'VN':
                setLanguage({ src: LogoVN, content: 'VN' });
                break;
            case 'ENG':
                setLanguage({ src: LogoENG, content: 'ENG' });
                break;
            case 'JP':
                setLanguage({ src: LogoJP, content: 'JP' });
                break;
            default:
                setLanguage({ src: LogoVN, content: 'VN' });
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
                        {dataLanguage.map(item => (
                            <div
                                onClick={() => setTypeLanguage(item.value)}
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
