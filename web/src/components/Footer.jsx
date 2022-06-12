import React, { useEffect, useState } from 'react';
import {getCurrentTime} from '../services/utilitiesService';
import logger from '../services/logService';

const Footer = () => {
    const [currentYear, setCurrentYear] = useState(Date.now.getFullYear);

    useEffect(() => {
        async function fetchData() {
            try {
                const {data} = await getCurrentTime();
                const date = new Date(Date.parse(data));
                setCurrentYear(date.getFullYear());
            } catch (err) {
                logger.log(err);
            }
        };

        fetchData();
    }, []);

    return (
        <footer className="footer">
          <div className="container">
              <h3 className="copyright">Montajes Parla - Copyright 2022</h3>
              <ul className="list list--inline">
                  <li className="list__item"><a href="#about-block">Empresa</a></li>
                  <li className="list__item"><a href="#services-block">Servicios</a></li>
                  <li className="list__item"><a href="#work-block">Trabajos</a></li>
                  <li className="list__item"><a href="#brand-block">Marcas</a></li>
                  <li className="list__item"><a href="#testimonial-block">Testimonial</a></li>
                  <li className="list__item"><a href="#contact-block">Contacto</a></li>
              </ul>
              <div className="footer__followus">
                  <p>Siguenos en</p>
                  <img src="/images/facebook-16.png" alt="Facebbok Icon" />
              </div>
          </div>
      </footer>
    );
};

export default Footer;