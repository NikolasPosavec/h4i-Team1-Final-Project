import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { auth } from "./firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import type { User } from "firebase/auth";
import { useState, useEffect } from "react";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Cart from "./pages/Cart";
import Landing from "./pages/Landing";
import Contact from "./pages/Contact";
import SearchResults from "./pages/SearchResults";
import Customer from "./pages/Customer";

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
          path="/signup"
          element={user ? <Navigate to="/" replace /> : <SignUp />}
        />

        <Route
          path="/"
          element={user ? <Landing /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/searchresults"
          element={user ? <SearchResults /> : <Navigate to="/login" replace />}
        />
        <Route 
          path = "/customer" 
          element = {<Customer/>}
          // element= {user ? <Customer/>: <Navigate to="/login" replace/>}
        />
        <Route path="/cart" element={<Cart />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
