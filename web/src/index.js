import React from "react";
import ReactDOM from "react-dom/client";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import logger from "./services/logService";
import App from "./components/App";
import Site from "./components/site/Site";
import FrmOrganization from "./components/admin/FrmOrganization";
import FrmInvitation from "./components/admin/FrmInvitation";
import FrmTestimonial from "./components/admin/FrmTestimonial";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";

logger.init();

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Site />} />
          <Route path="/organizations" element={<FrmOrganization />} />
          <Route path="/testimonials/invite" element={<FrmInvitation />} />
          <Route path="/testimonial/:code" element={<FrmTestimonial />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
