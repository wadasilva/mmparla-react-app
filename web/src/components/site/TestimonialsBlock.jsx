import React, { useEffect, useState } from "react";
import { getTestimonials } from "../../services/testimonialService";

const TestimonialsBlock = () => {
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const { data } = await getTestimonials();
      setTestimonials(data);
    }
    fetchData();
  }, []);

  return (testimonials.length > 0 &&
    <section
      id="testimonial-block"
      className="block block--light-gray testimonial-block"
    >
      <header className="block__header aos-overflow-hidden">
        <h2 className="block__heading" data-aos="fade-up">
          Qué dicen nuestros clientes
        </h2>
      </header>
      <div className="grid grid--1x3 container">
        {testimonials.map((item) => {
          return (
            <div key={item._id} className="media testimonial">
              <div className="media__image">
                <img src={`data:image/${item.photo.format};base64,${item.photo.image}`} alt="Witness" />
              </div>
              <div className="media__brand">
                <img src={`data:image/${item.invitation.organization.logo.format};base64,${item.invitation.organization.logo.image}`} alt="Logo Canoil" />
              </div>
              <div className="media__body">
                <p>{item.message}</p>
              </div>
              <div className="media__footer">
                <h3 className="media__footer-heading">{item.firstName} {item.lastName}</h3>
                <p>{item.rol}</p>
              </div>
            </div>
          );
        })}        
      </div>
    </section>
  );
};

export default TestimonialsBlock;
