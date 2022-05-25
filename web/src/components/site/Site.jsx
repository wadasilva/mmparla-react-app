import React, { useEffect } from "react";
import HeroBlock from "./HeroBlock";
import AboutBlock from "./AboutBlock";
import ServiceBlock from "./ServiceBlock";
import WorkBlock from "./WorkBlock";
import BrandBlock from "./BrandBlock";
import TestimonialsBlock from "./TestimonialsBlock";
import ContactBlock from "./ContactBlock";
import AOS from "aos";
import "aos/dist/aos.css";

const Site = () => {
  useEffect(() => {
    AOS.init();

    //Pushes the Navbar some pixels down when it's the website
    document.getElementsByClassName('nav')[0].classList.add('nav-down');

  }, []);

  return (
    <React.Fragment>
      <HeroBlock />
      <AboutBlock />
      <ServiceBlock />
      <WorkBlock />
      <BrandBlock />
      <TestimonialsBlock />
      <ContactBlock />
    </React.Fragment>
  );
};

export default Site;
