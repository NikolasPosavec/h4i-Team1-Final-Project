// import { useState } from 'react';

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../../car-dealership1/src/pages/Login";
import Cart from "../../car-dealership1/src/pages/Cart";
import Landing from "../../car-dealership1/src/pages/Landing";
import Contact from "../../car-dealership1/src/pages/Contact";


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
