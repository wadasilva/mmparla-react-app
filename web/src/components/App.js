import "./App.css";
import React from "react";
import NavBar from "./NavBar";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";

function App() {
  return (
    <React.Fragment>
      <NavBar />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
    </React.Fragment>
  );
}

export default App;
