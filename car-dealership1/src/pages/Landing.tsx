import { signOut } from "firebase/auth";
import { auth } from "../firebase/config";

function Landing() {
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <div>
      <h1>Landing Page: In Progress</h1>
      <button 
        type="button"
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  );
}

export default Landing;