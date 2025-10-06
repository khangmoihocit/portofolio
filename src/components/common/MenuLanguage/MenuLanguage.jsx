import React, { useState } from 'react';
import { useLanguage } from '../../../contexts';
import styles from './styles.module.scss';

const MenuLanguage = () => {
    const { currentLanguageData, languages, changeLanguage } = useLanguage();
    const {
        boxLanguage,
        menuLanguage,
        containerLanguage,
        wrapLanguage,
        boxLanguage1
    } = styles;

    const [isShowLanguage, setIsShowLanguage] = useState(false);

    return (
        <div
            className={containerLanguage}
            onMouseEnter={() => setIsShowLanguage(true)}
            onMouseLeave={() => setIsShowLanguage(false)}
        >
            <div className={boxLanguage}>
                <img src={currentLanguageData.flag} alt={currentLanguageData.name} />
                <p>{currentLanguageData.shortCode}</p>
            </div>
            {isShowLanguage && (
                <div className={menuLanguage}>
                    <b>Languages</b>
                    <div className={wrapLanguage}>
                        {languages.map((item) => (
                            <div
                                key={item.code}
                                onClick={() => {
                                    changeLanguage(item.code);
                                    setIsShowLanguage(false);
                                }}
                                className={boxLanguage1}
                            >
                                <img src={item.flag} alt={item.name} />
                                <p>{item.fullName}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MenuLanguage;
