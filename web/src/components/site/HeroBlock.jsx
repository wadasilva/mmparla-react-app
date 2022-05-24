import React from 'react';

const HeroBlock = () => {
    return (
        <section id="hero-block" className="block hero-block aos-overflow-hidden">
            <header id='block-header' className="block__header" data-aos="fade-zoom-in" data-aos-easing="linear" data-aos-duration="800">
                <h1 className="block__heading">Montaje de muebles Parla</h1>
                <p>Más de 12 años ofreciendo servicios de montaje, traslado y reparación de muebles</p>
            </header>
        </section>
    );
};

export default HeroBlock;