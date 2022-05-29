import React, { useEffect, useState } from "react";
import { getTestimonials, setState as setTestimonialState } from "../../services/testimonialService";
import TestimonialMedia from "../common/TestimonialMedia";
import auth from '../../services/authService';

const TestimonialsBlock = () => {
  const [testimonials, setTestimonials] = useState([]);

  const isAuthenticated = auth.getCurrentUser();

  useEffect(() => {
    async function fetchData() {
      const { data } = await getTestimonials();
      setTestimonials(data);
    }
    fetchData();
  }, []);

  const onAccept = async id => updateTestimonialState(id, true);
  const onReject = async id => updateTestimonialState(id, false);

  const updateTestimonialState = async (id, accept) => {
    const result = await setTestimonialState({ id: id, accepted: accept});

    const oldTestimonials = testimonials;
    const testimonial = oldTestimonials.filter(item => item._id === id)[0];
    const index = oldTestimonials.indexOf(testimonial);
    
    testimonial.accepted = accept;    
    oldTestimonials[index] = testimonial;

    setTestimonials([...oldTestimonials]);
  };

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
        {testimonials.map((item) => <TestimonialMedia key={item._id} testimonial={item} isAuthenticated={isAuthenticated} onAccept={ () => onAccept(item._id) } onReject={ () => onReject(item._id) } />)}  
      </div>
    </section>
  );
};

export default TestimonialsBlock;
