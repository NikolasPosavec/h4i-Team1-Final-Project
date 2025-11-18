// import { useState } from 'react';

import { BrowserRouter, Routes, Route } from "react-router";
import Login from "./pages/Login";
import Cart from "./pages/Cart";
import Landing from "./pages/Landing";
import Contact from "./pages/Contact";


function App() {
  // const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
    <Routes>
      <Route path = "/" element = {<Landing />}/>
      <Route path = "/cart" element = {<Cart />}/>
      <Route path = "/contact" element = {<Contact />}/>
      <Route path = "/login" element = {<Login />} />
    </Routes>
    </BrowserRouter>
  );
}
export default App
