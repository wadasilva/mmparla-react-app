import React from 'react';

const BrandBlock = () => {
    return (
        <section id="brand-block" className="block brand-block">
            <header className="block__header aos-overflow-hidden">
                <h2 className="block__heading" data-aos="fade-up">Algunas de las marcas que montamos</h2>
            </header>
            <div className="container">
                <div className="brands__item">
                    <a href="https://www.atrapamuebles.com/" target="_blank">
                        <picture>
                            <source srcSet="/images/logos/atrapa-muebles.webp" type="image/webp" />
                            <source srcSet="/images/logos/atrapa-muebles.jpg" type="image/jpg" />
                            <img src="/images/logos/atrapa-muebles.jpg" alt="Atrapa Muebles" />
                        </picture>                        
                    </a>
                </div>
                <div className="brands__item">
                    <a href="https://mueblescanoil.com/" target="_blank">
                        <picture>
                            <source srcSet="/images/logos/canoil.webp" type="image/webp" />
                            <source srcSet="/images/logos/canoil.png" type="image/png" />
                            <img src="/images/logos/canoil.png" alt="Canoil" />
                        </picture>
                    </a>
                </div>
                <div className="brands__item">
                    <a href="https://glicerio-chaves.com/" target="_blank">
                        <picture>
                            <source srcSet="/images/logos/glicero.webp" type="image/webp" />
                            <source srcSet="/images/logos/glicero.jpg" type="image/jpg" />
                            <img src="/images/logos/glicero.jpg" alt="Glicero" />
                        </picture>
                    </a>
                </div>
                <div className="brands__item">
                    <a href="https://www.exojo.com/" target="_blank">
                        <picture>
                            <source srcSet="/images/logos/exodo.webp" type="image/webp" />
                            <source srcSet="/images/logos/exodo.jpg" type="image/jpg" />
                            <img src="/images/logos/exodo.jpg" alt="Exojo" />
                        </picture>
                    </a>
                </div>
                <div className="brands__item">
                    <a href="https://www.maisonsdumonde.com/" target="_blank">
                        <picture>
                            <source srcSet="/images/logos/maisons.webp" type="image/webp" />
                            <source srcSet="/images/logos/maisons.jpg" type="image/jpg" />
                            <img src="/images/logos/maisons.jpg" alt="Maisons" />
                        </picture>
                    </a>
                </div>
                <div className="brands__item">
                    <a href="https://www.rimobel.es/" target="_blank">
                        <picture>
                            <source srcSet="/images/logos/rimobel.webp" type="image/webp" />
                            <source srcSet="/images/logos/rimobel.jpg" type="image/jpg" />
                            <img src="/images/logos/rimobel.jpg" alt="Rimobel" />
                        </picture>                        
                    </a>
                </div>
            </div>
        </section>
    );
};

export default BrandBlock;