import React from 'react';

const TestimonialMedia = ({testimonial, isAdmin, onAccept, onReject}) => {
    const {photo} = testimonial?.organization ?? {};

    return (
        <div className="media testimonial">
          <div className="media__image">
            <img src={`data:image/${testimonial.photo.format};base64,${testimonial.photo.image}`} alt="Witness" />
          </div>
          <div className="media__brand">
            <img src={`data:image/${photo?.format};base64,${photo?.image}`} alt="Logo Canoil" />
          </div>
          <div className="media__body">
            <p>{testimonial.message}</p>
          </div>
          <div className="media__footer">
            <h3 className="media__footer-heading">{testimonial.firstName} {testimonial.lastName}</h3>
            <p>{testimonial.rol}</p>
          </div>
          {isAdmin && <div className="action-buttons">
            {(testimonial.accepted === null || testimonial.accepted === undefined) && <button type="button" className="btn btn--success btn--small" onClick={ onAccept }>
              <svg className="icon icon--white icon--small">
                <use href="/images/sprite.svg#check"></use>
              </svg>
              Aceptar
            </button>
            }
            {(testimonial.accepted === null || testimonial.accepted === undefined) && <button className="btn btn--danger btn--small" onClick={ onReject }>
              <svg className="icon icon--white icon--small">
                <use href="/images/sprite.svg#times"></use>
              </svg>
              Rechazar
            </button>}
            { testimonial.accepted === true && <span className="badge badge--success">Aceptado</span> }
            { testimonial.accepted === false && <span className="badge badge--danger">Rechazado</span> }
          </div>}
        </div>
      );
};

export default TestimonialMedia;