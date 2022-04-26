import React from 'react';
import Map from './Map';

const ContactBlock = () => {
    return (
        <section id="contact-block" className="block contact-block">
            <header className="block__header aos-overflow-hidden">
                <h2 className="block__heading" data-aos="fade-up">Contacta con nosotros</h2>
            </header>
            <div className="grid grid--1x2 container aos-overflow-hidden">
                <div className="contact__address" data-aos="fade-right">
                    <div className="address__text">
                        <h3 className="contact-address__heading">Visitanos en</h3>
                        <p className="contact-address__text">C/ Juan Ramón Jiménez, 31 Esc. Derecha, 5º Pta 18 46006 Valencia</p>
                        
                        <h3 className="contact-address__heading">Llámanos o escribenos un WhatsApp a:</h3>
                        <a href="tel:+34-631-93-98-20" className="contact-address__phone">+34 631 93 98 20</a>
                    </div>
                    <Map />
                </div>
                <form action="/" className="contact__email aos-overflow-hidden" data-aos="fade-left">
                    <input type="text" className="input input--block" placeholder="Nombre" />
                    <input type="text" className="input input--block" placeholder="Email" />
                    <input type="text" className="input input--block" placeholder="Asunto" />
                    <textarea className="input input--block" placeholder="Comentario"></textarea>
                    <button className="btn btn--primary">enviar</button>
                </form>
            </div>
        </section>
    );
};

export default ContactBlock;