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
