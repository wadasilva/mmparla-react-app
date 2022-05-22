import React, { useEffect, useState } from 'react';
import { getPhotos } from '../../services/photoService';
import config from '../../config/config.json';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";

const WorkBlock = () => {
    const [images, setImages] = useState([]);

    useEffect(() => {
        async function fetchData() {
            const { data } = await getPhotos();
            setImages(getImages(data));
        }
    
        fetchData();
    }, []);

    function getImages(data) {
        let images = [];

        if (data) {
            images = data.map(image => {
                return {
                    id: image.id,
                    url: `${config.apiUrl}/${image.url}`,
                    description: image.description,
                    format: image.format,
                    breakpoints: image.breakpoints.map(breakpoint => {
                        return {
                            format: breakpoint.format,
                            breakpoint: breakpoint.images.map(image => `${config.apiUrl}/${image.url} ${image.width}w`).join(',')
                        }
                    }).sort((a, b) => {
                        if (a.format > b.format) return -1;
                        if (a.format < b.format) return 1;
    
                        return 0;
                    })
                };
            });
        }
    
        return images;
    }

    return (images.length > 0 &&
        <section id="work-block" className="block block--light-gray">
            <header className="block__header aos-overflow-hidden">
                <h2 className="block__heading" data-aos="fade-up">Nuestros trabajos</h2>
            </header>
            <div className="carrousel container">
                <Carousel showThumbs={true} renderThumbs={ (children) => children.map((item, index) => item.props.children)}>
                    { images.map((image, imageIndex) => {
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