import React, { useContext, useEffect, useState } from 'react';
import { getPhotos } from '../../services/photoService';
import config from '../../config/config.json';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import AppContext from '../../context/appContext';

const WorkBlock = () => {
    const {gallery} = useContext(AppContext);

    return (gallery?.galleryList && gallery.galleryList.length > 0 && 
        <section id="work-block" className="block block--light-gray">
            <header className="block__header aos-overflow-hidden">
                <h2 className="block__heading" data-aos="fade-up">Nuestros trabajos</h2>
            </header>
            <div className="carrousel container">
                <Carousel showThumbs={true} renderThumbs={ (children) => children.map((item, index) => item.props.children)}>
                    { gallery.galleryList.map((image, imageIndex) => {
                        return (
                            <div key={imageIndex}>
                                <picture>
                                    { image.breakpoints.map((source, breakpointIndex) => <source key={`${imageIndex}-${breakpointIndex}-${source.format}`} type={`image/${source.format}`} srcSet={source.breakpoint} />) }
                                    <img key={image.id} src={image.url} alt={image.description} />
                                </picture>
                            </div>
                        )                        
                    })}
                </Carousel>
            </div>
        </section>
    );
};

export default WorkBlock;