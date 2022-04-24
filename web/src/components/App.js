import './App.css';
import React from 'react';
import NavBar from './NavBar';
import Footer from './Footer';
import ServiceBlock from './ServiceBlock';
import AboutBlock from './AboutBlock';
import HeroBlock from './HeroBlock';
import WorkBlock from './WorkBlock';
import BrandBlock from './BrandBlock';
import TestimonialsBlock from './TestimonialsBlock';
import ContactBlock from './ContactBlock';

function App() {
  return (
    <React.Fragment>
      <NavBar />
      <main className="main-content">
        
        <HeroBlock />
        <AboutBlock />
        <ServiceBlock />
        <WorkBlock />
        <BrandBlock />
        <TestimonialsBlock />
        <ContactBlock />
      </main>    

      <Footer />
    </React.Fragment>
  );
}

export default App;
