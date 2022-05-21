import React from 'react';

const SliderThumbnail = ({index, image, selectedSlideItem, handleClick}) => {
    return (
        <a href={`#carrousel-item-${index}`} className={selectedSlideItem === index ? 'slider-item-active' : '' } onClick={ handleClick }>
            <div id={`slider-item-${index}`}>
                <picture>
                    { image.breakpoints.map((source) => <source key={source.breakpoint} type={`image/${source.extention}`} srcSet={source.breakpoint} />) }

                    <img key={index} src={image.url} alt={image.description} />
                </picture>
            </div>
        </a>
    );
};

export default SliderThumbnail;