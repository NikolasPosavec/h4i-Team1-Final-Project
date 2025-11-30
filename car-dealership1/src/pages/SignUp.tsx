import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase/config";
import ShellFaxLogo from '../assets/ShellFaxLogo.jpeg';
import {
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";


function SignUp() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignUp = async () => {
    try {
      {/**allows the user to create an account */}
      const userInfo = await createUserWithEmailAndPassword(auth, email, password);
      const user = userInfo.user;
      {/**given the domain of the email address, if it ends with "@shellfax.com.com", assign the role "vendor", otherwise "customer" */}
      const role = email.endsWith("@shellfax.com") ? "vendor" : "customer";

      await setDoc(doc(db,"users", user.uid), {
        email: email,
        role: role,
    });

    {/**based on the users role, it will navigate to the appropriate page */}
    if (role === "vendor") {
      navigate("/vendorProduct");
    } else {
      navigate("/");
    }
      
    } catch (err) {
      setError(String(err) || "Sign up failed");
    }
  };

  return (
    <div>
      <div>
        <img src={ShellFaxLogo} alt="ShellFax Logo" className="w-[542px] h-[131px] top-[13px] left-[20px] bg-white" />
      </div>
      <div className="flex justify-center">
        <div className="relative w-[548px] h-[646px] bg-[#D1D1D6] rounded-[28px] border-[5px] border-[#0000003D] pt-6">
          <button 
            onClick={() => navigate("/login")}
            className="absolute top-4 left-4 px-4 py-2 text-sm font-medium text-black hover:underline"
          >
            Login
          </button>
          <div className="flex justify-center pt-[9.63px]">
            <div className="w-[60.75px] h-[57.75px] border-2 border-black rounded-full flex flex-col items-center pt-2 relative">
            <div className="w-[24px] h-[24px] border-2 border-black rounded-full"></div>
            <div className="absolute bottom-1 w-[32px] h-[12px] overflow-hidden">
              <div className="w-[32px] h-[32px] border-2 border-black rounded-full "></div>
            </div>
          </div>
          </div>
          <div className="flex flex-col items-center">
            <h1 className="font-['Montserrat'] font-bold text-[40px] text-center">SIGN UP</h1>
            <h1 className="font-['Static/Headline Small/Font'] text-[25px] font-medium text-center text-[#00000091]">Join the ShellFax Family!</h1>
          </div>
          
          <div className="flex flex-col items-center mt-10">
          <div className="w-[360px] h-[56px] bg-[#FFFFFF] rounded-[28px] flex items-center px-[4px] pl-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-full bg-transparent border-none outline-none placeholder:text-black"
          />
          </div>
          </div>
        
          <div className="flex flex-col items-center mt-10">
          <div className="w-[360px] h-[56px] bg-[#FFFFFF] rounded-[28px] flex items-center px-[4px] pl-4">
          <input
            type="password"
            placeholder="Password"
            value={password} 
            onChange={(e) => setPassword(e.target.value)}
            className="w-full h-full bg-transparent border-none outline-none placeholder:text-black"
          />
          </div>
          </div>
          <div className="flex flex-col items-center mt-10">
            <button 
              onClick={handleSignUp}
              className="w-[300px] h-[48px] bg-[#F5BC13] rounded-[24px] text-black font-semibold text-lg hover:bg-[#FF0505]"
            >
              Sign Up
            </button>
          </div>
          {error && <div>{error}</div>}
        </div>
      </div>
    </div>
  );
}

export default SignUp;