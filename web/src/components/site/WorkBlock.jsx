import React, { useEffect, useState } from 'react';
import { getPhotos } from '../../services/photoService';
import config from '../../config/config.json';
import SliderThumbnail from '../common/SliderThumbnail';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";

const WorkBlock = () => {
    const [images, setImages] = useState([]);
    const [selectedSlideItem, setSelectedSlideItem] = useState(0);

    useEffect(() => {
        async function fetchData() {
            const { data } = await getPhotos();
            setImages(getImages(data));
        }
    
        fetchData();
    }, []);

    // useEffect(() => {
    //     document.getElementById(`carrousel-item-${selectedSlideItem}`)?.scrollIntoView();
    // }, [selectedSlideItem]);


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
    
    const handleCarrouselClick = (direction) =>  {
        if (direction === 'prev' && selectedSlideItem > 0) {
            setSelectedSlideItem(selectedSlideItem - 1);
        } else if (direction === 'next' && selectedSlideItem < images.length - 1) {
            setSelectedSlideItem(selectedSlideItem + 1);
        }            
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
            
                {/* <div className="carrousel__navigator">
                    <a href={`#slider-item-${ selectedSlideItem > 0 ? selectedSlideItem - 1 : selectedSlideItem}`} className="slider__chevron" onClick={ () => handleCarrouselClick('prev') }>
                        <img src="/images/left-arrow.png" alt="" />
                    </a>
        
                    <a href={`#slider-item-${ selectedSlideItem < images.length - 1 ? selectedSlideItem + 1 : selectedSlideItem }`} className="slider__chevron" onClick={ () => handleCarrouselClick('next') }>
                        <img src="/images/right-arrow.png" alt="" />
                    </a>
                </div> */}
            </div>
        </section>
    );
};

export default WorkBlock;