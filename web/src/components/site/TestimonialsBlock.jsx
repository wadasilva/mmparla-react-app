import React, { useContext, useEffect, useState } from "react";
import { getTestimonials, setState as setTestimonialState } from "../../services/testimonialService";
import TestimonialMedia from "../common/TestimonialMedia";
import auth from '../../services/authService';
import AppContext from "../../context/appContext";

const TestimonialsBlock = () => {
  const { testimonial, user } = useContext(AppContext);

  const onAccept = async id => updateTestimonialState(id, true);
  const onReject = async id => updateTestimonialState(id, false);

  const updateTestimonialState = async (id, accept) => {
    const result = await setTestimonialState({ id: id, accepted: accept});

    const oldTestimonials = testimonial.testimonialList;
    const filteredTestimonial = oldTestimonials.filter(item => item._id === id)[0];
    const index = oldTestimonials.indexOf(filteredTestimonial);
    
    filteredTestimonial.accepted = accept;    
    oldTestimonials[index] = filteredTestimonial;

    testimonial.setTestimonialList([...oldTestimonials]);
  };

  return (testimonial.testimonialList.length > 0 &&
    <section
      id="testimonial-block"
      className="block testimonial-block"
    >
      <header className="block__header aos-overflow-hidden">
        <h2 className="block__heading" data-aos="fade-up">
          Qué dicen nuestros clientes
        </h2>
      </header>
      <div className="grid grid--1x3 container">
        {testimonial.testimonialList.map((item) => <TestimonialMedia key={item._id} testimonial={item} isAuthenticated={user.currentUser} onAccept={ () => onAccept(item._id) } onReject={ () => onReject(item._id) } />)}  
      </div>
    </section>
  );
};

export default TestimonialsBlock;
