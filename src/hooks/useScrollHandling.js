import React, { useEffect, useRef, useState } from 'react';

const useScrollHandling = () => {
    const [scrollDriction, setScrollDriction] = useState(null);
    const previousScrollPosition = useRef(0);
    const [scrollPosition, setScrollPosition] = useState(0);

    const scrollTracking = () => {
        const currentScrollPosition = window.pageYOffset; //vị trí hiện tại of scroll
        if (currentScrollPosition > previousScrollPosition.current) {
            setScrollDriction('down');
        } else if (currentScrollPosition < previousScrollPosition.current) {
            setScrollDriction('up');
        }

        previousScrollPosition.current =
            currentScrollPosition <= 0 ? 0 : currentScrollPosition;

        setScrollPosition(currentScrollPosition);
    };

    useEffect(() => {
        window.addEventListener('scroll', scrollTracking);
        return () => window.removeEventListener('scroll', scrollTracking);
    }, []);

    return {
        scrollPosition,
        scrollDriction
    };
};

export default useScrollHandling;
