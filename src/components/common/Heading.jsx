import React from 'react';

const Heading = ({title, bgTitle}) => {
    return (
        <div className="section-heading">
            <h2 className="title">{title}</h2>
                <div className="title-anim">
                    <span></span>
                </div>
            <span className="bg-title" aria-hidden="true">
                {bgTitle}
            </span>
         </div>
    );
};

export default Heading;