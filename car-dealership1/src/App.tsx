

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { auth } from "./firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import type { User } from "firebase/auth";
import { useState, useEffect } from "react";
import Login from "../../car-dealership1/src/pages/Login";
import Cart from "../../car-dealership1/src/pages/Cart";
import Landing from "../../car-dealership1/src/pages/Landing";
import Contact from "../../car-dealership1/src/pages/Contact";
import ForgotPassword from "../../car-dealership1/src/pages/ForgotPassword";



function App() {
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return unsub;
  }, []);


  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={user ? <Navigate to="/" replace /> : <Login />}
        />
        <Route
          path="/forgot-password"
          element={user ? <Navigate to="/" replace /> : <ForgotPassword />}
        />
       
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route 
        path="/" 
        element={user ? <Landing /> : <Navigate to="/login" replace />}
      />
      <Route path = "/cart" element = {<Cart />}/>
      <Route path = "/contact" element = {<Contact />}/>
      <Route path = "/login" element = {<Login />} />
    </Routes>
    </BrowserRouter>
  );
}
export default App
