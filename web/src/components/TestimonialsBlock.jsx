import React from 'react';

const TestimonialsBlock = () => {
    return (
        <section id="testimonial-block" className="block block--light-gray testimonial-block">
            <header className="block__header aos-overflow-hidden">
                <h2 className="block__heading" data-aos="fade-up">Qué dicen nuestros clientes</h2>
            </header>
            <div className="grid grid--1x3 container">
                <div className="media testimonial">
                    <div className="media__image">
                        <img src="/images/profiles/Asset-3.png" alt="Profile picture" />
                    </div>
                    <div className="media__brand">
                        <img src="/images/icon-11.png" alt="Logo Canoil" />
                    </div>
                    <div className="media__body">
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Beatae officiis itaque laborum nostrum non unde voluptatibus repudiandae incidunt nobis qui facere temporibus deserunt officia hic culpa quaerat ad, ducimus, tempore harum labore vitae impedit magnam! Modi fugit laborum maxime magni eos reiciendis temporibus sint ullam ipsum, quasi quis, soluta aliquam.</p>
                    </div>
                    <div className="media__footer">
                        <h3 className="media__footer-heading">Jennifer Christofer</h3>
                        <p>Gerente de Maisons du Monde</p>
                    </div>
                </div>
    
                <div className="media testimonial">
                    <div className="media__image">
                        <img src="/images/profiles/Asset-4.png" alt="Profile picture" />
                    </div>
                    <div className="media__brand">
                        <img src="/images/icon-12.png" alt="Logo Canoil" />
                    </div>
                    <div className="media__body">
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Error, natus. Culpa sit excepturi ab, dolor perferendis vitae, nam rerum laudantium nisi eius similique laboriosam enim quam, voluptatem totam odio molestiae.</p>
                    </div>
                    <div className="media__footer">
                        <h3 className="media__footer-heading">Jennifer Christofer</h3>
                        <p>Gerente de Maisons du Monde</p>
                    </div>
                </div>
    
                <div className="media testimonial">
                    <div className="media__image">
                        <img src="/images/profiles/Asset-5.png" alt="Profile picture" />
                    </div>
                    <div className="media__brand">
                        <img src="/images/icon-10.png" alt="Logo Canoil" />
                    </div>
                    <div className="media__body">
                        <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eos, dicta nisi. Totam nihil repudiandae placeat, aliquam delectus dicta odio est porro exercitationem dignissimos. Repellendus officia fuga libero quod voluptates recusandae, esse, atque doloremque minima maxime rem laudantium ipsam sit, neque aliquid voluptas. Ipsa aliquam ullam incidunt ad illo! Commodi, voluptate a voluptatum eius laudantium doloremque ullam blanditiis ad excepturi ea corrupti, eaque mollitia similique nesciunt, sequi earum neque consequatur molestias!</p>
                    </div>
                    <div className="media__footer">
                        <h3 className="media__footer-heading">Jennifer Christofer</h3>
                        <p>Gerente de Maisons du Monde</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TestimonialsBlock;