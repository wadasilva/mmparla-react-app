import React from 'react';

const AboutBlock = () => {
    return (
        <section id="about-block" className="block block--light-gray about-block">
            <header className="block__header">
                <h2 className="block__heading" data-aos="fade-up">Sobre nosotros</h2>
            </header>
            <div className="grid grid--1x2 container about__content aos-overflow-hidden">
                <img src="/images/Asset 1.png" alt="" className="about__picture" data-aos="fade-right" data-aos-duration="800" />
                <div className="about__text" data-aos="fade-left" data-aos-duration="800">
                    <p>En la actualidad, existe una demanda creciente de servicios de reparto como consecuencia del aumento de ventas, especialmente online. Por este motivo, el sector de la logística se está convirtiendo en uno de los pilares de la economía, obligado a reinventarse continuamente para adaptarse a las necesidades del mercado.</p>
                    <p>MM Parla cuenta con más de 10 años de experiencia en montaje, traslado, reparación, reparto y reciclaje de muebles y un equipo consolidado y en constante formación para poder adaptarse a estos cambios.</p>
                </div>
            </div>            
        </section>
    );
};

export default AboutBlock;