import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import NavBar from "./NavBar";
import Footer from "./Footer";
import auth from "../services/authService";
import { getPhotos, parseImages } from "../services/photoService";
import { getTestimonials } from "../services/testimonialService";
import AppContext from "../context/appContext";
import config from "../config/config.json";
import "./App.css";

function App() {
  const [user, setUser] = useState();
  const [images, setImages] = useState([]);
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const user = auth.getCurrentUser();
      setUser(user);

      const { data: imageList } = await getPhotos();
      setImages(parseImages(imageList));
      const { data: testimonialList } = await getTestimonials();
      setTestimonials(testimonialList);
    }

    fetchData();
  }, []);

  const setUserState = (user) => setUser(user);
  const setGalleryList = (galleries) => setImages(galleries);
  const setTestimonialList = (testimonials) => setTestimonials(testimonials);

  return (
    <React.Fragment>
      <AppContext.Provider
        value={{
          user: { currentUser: user, setUserState },
          gallery: { galleryList: images, setGalleryList },
          testimonial: { testimonialList: testimonials, setTestimonialList },
        }}
      >
        <ToastContainer />
        <NavBar />
        <main className="main-content">
          <Outlet />
        </main>
        <Footer />
      </AppContext.Provider>
    </React.Fragment>
  );
}

export default App;
