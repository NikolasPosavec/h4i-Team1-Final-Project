import { Link } from "react-router-dom";
import { FaShoppingCart, FaHome } from "react-icons/fa";
import { IoIosContacts } from "react-icons/io";
import { CiLogin } from "react-icons/ci";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/config";
/**import { CiSearch } from "react-icons/ci";*/
import { useNavigate } from "react-router-dom";

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
    /**Made the navigation color of the navbar is red with white text */
    <nav className="bg-red-500 p-4">
      <div className="text-center">
        <h1 className="font-extrabold text-4xl">SHELLFAX</h1>
        <h2 className="font-bold text-2xl">Car Dealership</h2>
      </div>

      {/**Pushed all the items to the end and lined up as a row. Added spacing between each icon*/}
      <div className="flex justify-end space-x-2">
        {/**This is the button that takes you to the landing or login page */}
        <Link to="/">
          <FaHome color="yellow" size={30}/>
        </Link>

        {/**This is the button that takes you to the cart page */}
        <Link to="/cart">
          <FaShoppingCart color="yellow" size={30}/>
        </Link>

        {/**This is the button that takes you to the contact page */}
        <Link to="/contact">
          <IoIosContacts color="yellow" size={30}/>
        </Link>

        {/**This is the button that logs you out */}
        <button
          onClick={handleLogout}
          aria-label="Logout"
          className="text-yellow"
          type="button"
        >
          <CiLogin color="black" size={30}/>
        </button>

        {/**This is the button that takes you to the search skeleton page 
                 * NOTE: Search page skeleton is not yet implemented
                <Link to = "/search"> 
                    <CiSearch color="yellow"/> 
                </Link>
                */}
      </div>
    </nav>
  );
};

export default Navbar;
