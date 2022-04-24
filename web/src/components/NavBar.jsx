import React, { useState } from 'react';

const NavBar = () => {
  const [toggled, setToggled] = useState(0);

  return (
    <nav className={toggled ? 'nav collapsible collapsible--expanded' : 'nav collapsible'} onClick={() => setToggled(!toggled)}>
        <a href="/">
          <img
            src="/images/parla.png"
            alt="Logo Montajes Parla"
            className="nav__brand"
          />
        </a>
        <a href="tel:+34-631-93-98-20" className="nav_phone">
          +34 631 93 98 20
        </a>
        <svg className="icon icon--primary nav__toggler">
          <use xlinkHref="images/sprite.svg#menu"></use>
        </svg>
        <ul className="list nav__list collapsible__content">
          <li className="nav__item">
            <a href="#about-block" className="link">
              Sobre nosotros
            </a>
          </li>
          <li className="nav__item">
            <a href="#services-block" className="link">
              servicios
            </a>
          </li>
          <li className="nav__item">
            <a href="#work-block" className="link">
              galeria
            </a>
          </li>
          <li className="nav__item">
            <a href="#testimonial-block" className="link">
              testimonios
            </a>
          </li>
          <li className="nav__item">
            <a href="#contact-block" className="link">
              contacto
            </a>
          </li>
        </ul>
      </nav>
  );
};

export default NavBar;