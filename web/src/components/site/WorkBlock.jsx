import React, { useEffect, useState } from 'react';
import { getPhotos } from '../../services/photoService';
import config from '../../config/config.json';

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

    useEffect(() => {
        document.getElementById(`carrousel-item-${selectedSlideItem}`)?.scrollIntoView();
    }, [selectedSlideItem]);


    function getImages(data) {
        let images = [];

        if (data) {
            images = data.map(image => {
                return {
                    id: image.id,
                    url: `${config.apiUrl}/${image.url}`,
                    description: image.description,
                    extention: image.extention,
                    breakpoints: image.breakpoints.map(breakpoint => {
                        return {
                            extention: breakpoint.extention,
                            breakpoint: breakpoint.images.map(image => `${config.apiUrl}/${image.url} ${image.width}w`).join(',')
                        }
                    }).sort((a, b) => {
                        if (a.extention > b.extention) return -1;
                        if (a.extention < b.extention) return 1;
    
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

    return (
        <section id="work-block" className="block block--light-gray">
            <header className="block__header aos-overflow-hidden">
                <h2 className="block__heading" data-aos="fade-up">Nuestros trabajos</h2>
            </header>
            <div className="carrousel container">
                {/* carrousel slides */}
                <div className="carrousel__slides">
                    { images.map((image, index) => {
                        return (
                            <div key={index} id={`carrousel-item-${index}`} className="carrousel__slides-item">
                                <picture className="carrousel__item">
                                    { image.breakpoints.map((source) => {
                                        return <source key={`${index}-${source.extention}`} type={`image/${source.extention}`} srcSet={source.breakpoint} />
                                    }) }

                                    <img className="carrousel__item" key={image.id} src={image.url} alt={image.description} />
                                </picture>
                            </div>
                        )
                    })}
                </div>
            
                {/* carrousel navgator */}
                <div className="carrousel__navigator">
                    <a href={`#slider-item-${ selectedSlideItem > 0 ? selectedSlideItem - 1 : selectedSlideItem}`} className="slider__chevron" onClick={ () => handleCarrouselClick('prev') }>
                        <img src="/images/left-arrow.png" alt="" />
                    </a>
                    
                    <div className="slider__thumbnails">
                        { images.map((image, index) => {
                            return (
                                <a key={index} href={`#carrousel-item-${index}`} className={selectedSlideItem === index ? 'slider-item-active' : '' } onClick={ () => setSelectedSlideItem(index) }>
                                    <div id={`slider-item-${index}`}>
                                        <picture>
                                            { image.breakpoints.map((source) => <source key={source.breakpoint} type={`image/${source.extention}`} srcSet={source.breakpoint} />) }

                                            <img key={index} src={image.url} alt={image.description} />
                                        </picture>
                                    </div>
                                </a>        
                            )
                        }) }
                    </div>
        
                    <a href={`#slider-item-${ selectedSlideItem < images.length - 1 ? selectedSlideItem + 1 : selectedSlideItem }`} className="slider__chevron" onClick={ () => handleCarrouselClick('next') }>
                        <img src="/images/right-arrow.png" alt="" />
                    </a>
                </div>
            </div>
        </section>
    );
};

export default WorkBlock;