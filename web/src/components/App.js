import "./App.css";
import React from "react";
import NavBar from "./NavBar";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <React.Fragment>
      <ToastContainer />
      <NavBar />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
    </React.Fragment>
  );
}

export default App;
