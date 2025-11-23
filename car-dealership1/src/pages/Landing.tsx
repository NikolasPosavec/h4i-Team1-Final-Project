import { signOut } from "firebase/auth";
import { auth } from "../firebase/config";
import { Navbar } from "../components/navbar";


function Landing() {
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <div className="bg-red-500 p-4 text-white" >
      <h1>Landing Page: In Progress</h1>
      <Navbar onLogout={handleLogout}/>

      <button className="flex justify-end space-x-2" type="button" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}

export default Landing;
