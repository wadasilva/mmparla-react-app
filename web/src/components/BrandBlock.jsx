import React from 'react';

const BrandBlock = () => {
    return (
        <section id="brand-block" className="block brand-block">
            <header className="block__header aos-overflow-hidden">
                <h2 className="block__heading" data-aos="fade-up">Algunas de las marcas que montamos</h2>
            </header>
            <div className="container">
                <div className="brands__item"><a href="https://www.atrapamuebles.com/" target="_blank"><img src="/images/logos-09.jpg" alt="" /></a></div>
                <div className="brands__item"><a href="#"><img src="/images/logos-10.jpg" alt="" /></a></div>
                <div className="brands__item"><a href="https://mueblescanoil.com/" target="_blank"><img src="/images/logos-11.jpg" alt="" /></a></div>
                <div className="brands__item"><a href="https://glicerio-chaves.com/" target="_blank"><img src="/images/logos-12.jpg" alt="" /></a></div>
                <div className="brands__item"><a href="https://www.exojo.com/" target="_blank"><img src="/images/logos-14.jpg" alt="" /></a></div>
                <div className="brands__item"><a href="https://www.maisonsdumonde.com/" target="_blank"><img src="/images/logos-13.jpg" alt="" /></a></div>
                <div className="brands__item"><a href="https://www.rimobel.es/" target="_blank"><img src="/images/logos-15.jpg" alt="" /></a></div>
            </div>
        </section>
    );
};

export default BrandBlock;