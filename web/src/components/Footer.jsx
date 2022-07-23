import React, { useContext, useEffect, useState } from 'react';
import { HashLink } from "react-router-hash-link";
import {getCurrentTime} from '../services/utilitiesService';
import logger from '../services/logService';
import AppContext from '../context/appContext';

const Footer = () => {
    const [currentYear, setCurrentYear] = useState(Date.now.getFullYear);
    const {testimonial, gallery} = useContext(AppContext);

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
              <h3 className="copyright">Montajes Parla - Copyright {currentYear}</h3>
              <ul className="list list--inline">
                  <li className="list__item"><HashLink smooth to={"/#about-block"}>Empresa</HashLink></li>
                  <li className="list__item"><HashLink smooth to={"/#services-block"}>Servicios</HashLink></li>
                  { gallery.galleryList.length > 0 && <li className="list__item"><HashLink smooth to={"/#work-block"}>Galeria</HashLink></li>}
                  { testimonial.testimonialList.length > 0 &&  <li className="list__item"><HashLink smooth to={"/#testimonial-block"}>Testimonial</HashLink></li>}
                  <li className="list__item"><HashLink smooth to={"/#brand-block"}>Marcas</HashLink></li>
                  <li className="list__item"><HashLink smooth to={"/#contact-block"}>Contacto</HashLink></li>
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