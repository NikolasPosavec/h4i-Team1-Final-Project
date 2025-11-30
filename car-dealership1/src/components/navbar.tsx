import { Link } from "react-router-dom";
import { FaShoppingCart, FaHome } from "react-icons/fa";
import { IoIosContacts } from "react-icons/io";
import { BsPersonCircle } from "react-icons/bs";
import { CiLogin } from "react-icons/ci";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/config";
import { useNavigate } from "react-router-dom";
import shellfaxLogo from "../assets/images/shellfax-logo.png";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <nav className="bg-red-500 p-4">
      <div className="flex items-center justify-between">
        {/* Logo on the left */}
        <Link to="/" className="flex items-center">
          <img
            src={shellfaxLogo}
            alt="Shellfax Logo"
            className="h-16 w-auto"
          />
        </Link>

        {/* Navigation icons on the right */}
        <div className="flex items-center space-x-4">
          <Link to="/" aria-label="Home">
            <FaHome color="yellow" size={30} />
          </Link>

          <Link to="/cart" aria-label="Cart">
            <FaShoppingCart color="yellow" size={30} />
          </Link>

          <Link to="/contact" aria-label="Contact">
            <IoIosContacts color="yellow" size={30} />
          </Link>

          <Link to="/customer" aria-label = "Profile"> 
            <BsPersonCircle color = "yellow" size={30} />
          </Link>
          
          <button
            onClick={handleLogout}
            aria-label="Logout"
            className="text-yellow"
            type="button"
          >
            <CiLogin color="black" size={30} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;