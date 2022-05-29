import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import NavBar from "./NavBar";
import Footer from "./Footer";
import auth from "../services/authService";
import "./App.css";

function App() {
  const [user, setUser] = useState();

  useEffect(() => {
    const user = auth.getCurrentUser();
    setUser(user);
  }, []);

  return (
    <React.Fragment>
      <ToastContainer />
      <NavBar user={user} />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
    </React.Fragment>
  );
}

export default App;
