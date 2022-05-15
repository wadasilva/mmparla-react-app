import React, { useState } from 'react';
import { HashLink } from 'react-router-hash-link';
import {Link} from 'react-router-dom';

const NavBar = (props) => {
  const [toggled, setToggled] = useState(0);

  return (
    <nav className={toggled ? 'nav collapsible collapsible--expanded' : 'nav collapsible'} onClick={() => setToggled(!toggled)}>
        <Link to="/">
          <img
            src="/images/parla.png"
            alt="Logo Montajes Parla"
            className="nav__brand"
          />
        </Link>
        <a href="tel:+34-631-93-98-20" className="nav_phone">
          +34 631 93 98 20
        </a>
        <svg className="icon icon--primary nav__toggler">ºº
          <use xlinkHref="/images/sprite.svg#menu"></use>
        </svg>
        <ul className="list nav__list collapsible__content">
          <li className="nav__item">
            <HashLink className="link" smooth to={'/#about-block'}>Sobre nosotros</HashLink>
          </li>
          <li className="nav__item">
            <HashLink className="link" smooth to={'/#services-block'}>servicios</HashLink>
          </li>
          <li className="nav__item">
            <HashLink className="link" smooth to={'/#work-block'}>galeria</HashLink>
          </li>
          <li className="nav__item">
            <HashLink className="link" smooth to={'/#testimonial-block'}>testimonios</HashLink>
          </li>
          <li className="nav__item">
            <HashLink className="link" smooth to={'/#contact-block'}>contacto</HashLink>
          </li>
          <li className="nav__item">
            <Link className="link" to={'/organizations'}>clientes</Link>
          </li>
        </ul>
      </nav>
  );
};

export default NavBar;