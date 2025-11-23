import { signOut } from "firebase/auth";
import { auth } from "../firebase/config";
import { Navbar } from "../components/navbar";

function Cart(){
const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

    return(
        <>
        <div> 
            <h1> Cart Page: In Progress</h1> 
            <Navbar onLogout={handleLogout}/>
        </div> 
        </>
    )
}

export default Cart