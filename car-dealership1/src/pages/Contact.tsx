import { signOut } from "firebase/auth";
import { auth } from "../firebase/config";
import { Navbar } from "../components/navbar";

function Contact(){
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
            <h1> Contact Page: In Progress</h1> 
            <Navbar onLogout={handleLogout}/>
        </div> 
        </>
    )
}

export default Contact