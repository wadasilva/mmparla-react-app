import React from 'react';

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
                    {/* <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3080.666977265592!2d-0.3776721842966234!3d39.454258421531534!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd604f2d5a920aa3%3A0xf5e0704e226b7838!2sCarrer%20de%20Juan%20Ram%C3%B3n%20Jim%C3%A9nez%2C%2031%2C%2046004%20Val%C3%A8ncia!5e0!3m2!1ses!2ses!4v1617729386522!5m2!1ses!2ses"
                            width="100%"
                            height="500"
                            style="border: 0"
                            allowfullscreen=""
                            loading="lazy"></iframe> */}
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