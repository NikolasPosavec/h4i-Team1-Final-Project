import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase/config";
import ShellFaxLogo from "../assets/ShellFaxLogo.jpeg";
import { signInWithEmailAndPassword } from "firebase/auth";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError(String(err) || "Login failed");
    }
  };

  return (
    <div className="bg-[#fefcf8]">
      <div>
        <img
          src={ShellFaxLogo}
          alt="ShellFax Logo"
          className="w-[542px] h-[131px] top-[13px] left-[20px]"
        />
      </div>
      <div className="flex justify-center">
        <div className="relative w-[548px] h-[646px] bg-[#D1D1D6] rounded-[28px] border-[5px] border-[#0000003D] pt-6">
          <button
            onClick={() => navigate("/signup")}
            className="absolute top-4 left-4 px-4 py-2 text-sm font-medium text-black hover:underline"
          >
            Sign Up
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
            <h1 className="font-['Montserrat'] font-bold text-[40px] text-center">
              LOGIN
            </h1>
            <h1 className="font-['Static/Headline Small/Font'] text-[25px] font-medium text-center text-[#00000091]">
              Join the ShellFax Family!
            </h1>
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
              onClick={handleLogin}
              className="w-[300px] h-[48px] bg-[#F5BC13] rounded-[24px] text-black font-semibold text-lg hover:bg-[#FF0505]"
            >
              Login
            </button>
          </div>
          {error && <div>{error}</div>}
        </div>
      </div>
    </div>
  );
}

export default Login;
