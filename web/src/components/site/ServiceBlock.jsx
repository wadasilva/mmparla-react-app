import React from 'react';

const ServiceBlock = () => {
    return (
        <section id="services-block" className="block services-block">
            <header className="block__header aos-overflow-hidden">
                <h2 className="block__heading" data-aos="fade-up">Nuestros Servicios</h2>
            </header>
            <div className="container">
                
                <div className="services__item">
                    <div className="media">
                        <div className="media__image">
                            <svg className="icon icon--primary">
                                <use xlinkHref="images/sprite.svg#iconos-04"></use>
                            </svg>
                        </div>
                        <div className="media__body">
                            <h2 className="media__title">Montaje de muebles</h2>
                            <p >Montadores expertos con más de 10 años de experiencia en el sector</p>
                        </div>
                    </div>
                </div>
    
                <div className="services__item">
                    <div className="media">
                        <div className="media__image">
                            <svg className="icon icon--primary">
                                <use xlinkHref="images/sprite.svg#iconos-05"></use>
                            </svg>
                        </div>
                        <div className="media__body">
                            <h2 className="media__title">Traslado de mercancias</h2>
                            <p>Flotas de camiones propias para recogida en tienda o traslado de la mercancía bajo los más altos niveles de calidad / seguridad</p>
                        </div>
                    </div>
                </div>
    
                <div className="services__item">
                    <div className="media">
                        <div className="media__image">
                            <svg className="icon icon--primary">
                                <use xlinkHref="images/sprite.svg#iconos-06"></use>
                            </svg>
                        </div>
                        <div className="media__body">
                            <h2 className="media__title">Pequeñas reparaciones</h2>
                            <p>Ajustes, cambios y arreglos de pequeñas averías. Reemplazo por materiales de alta calidad</p>
                        </div>
                    </div>
                </div>
    
                <div className="services__item">
                    <div className="media">
                        <div className="media__image">
                            <svg className="icon icon--primary">
                                <use xlinkHref="images/sprite.svg#iconos-07"></use>
                            </svg>
                        </div>
                        <div className="media__body">
                            <h2 className="media__title">Deshecho / Reciclaje</h2>
                            <p>Reciclaje y deshecho del producto indeseable en nuestro propio local de reciclaje</p>
                        </div>
                    </div>
                </div>
    
                <div className="services__item">
                    <div className="media">
                        <div className="media__image">
                            <svg className="icon icon--primary">
                                <use xlinkHref="images/sprite.svg#iconos-08"></use>
                            </svg>
                        </div>
                        <div className="media__body">
                            <h2 className="media__title">Reparto de mercancias</h2>
                            <p>Recogida de mercancías en el centro de distribución / tienda y reparto en el menor tiempo posible</p>
                        </div>
                    </div>
                </div>
    
            </div>
        </section>
    );
};

export default ServiceBlock;