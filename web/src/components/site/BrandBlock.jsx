import React from 'react';

const BrandBlock = () => {
    return (
        <section id="brand-block" className="block brand-block">
            <header className="block__header aos-overflow-hidden">
                <h2 className="block__heading" data-aos="fade-up">Algunas de las marcas que montamos</h2>
            </header>
            <div className="container">
                <div className="brands__item"><a href="https://www.atrapamuebles.com/" target="_blank"><img src="/images/logos/atrapa muebles.jpg" alt="" /></a></div>
                <div className="brands__item"><a href="#"><img src="/images/logos/martegu.png" alt="" /></a></div>
                <div className="brands__item"><a href="https://mueblescanoil.com/" target="_blank"><img src="/images/logos/canoil.png" alt="" /></a></div>
                <div className="brands__item"><a href="https://glicerio-chaves.com/" target="_blank"><img src="/images/logos/glicero.png" alt="" /></a></div>
                <div className="brands__item"><a href="https://www.exojo.com/" target="_blank"><img src="/images/logos/exodo.jpg" alt="" /></a></div>
                <div className="brands__item"><a href="https://www.maisonsdumonde.com/" target="_blank"><img src="/images/logos/maisons.jpg" alt="" /></a></div>
                <div className="brands__item"><a href="https://www.rimobel.es/" target="_blank"><img src="/images/logos/rimobel.jpg" alt="" /></a></div>
            </div>
        </section>
    );
};

export default BrandBlock;