import { useState } from "react";
import { Link } from "react-router-dom";
import { auth } from "../firebase/config";
import { sendPasswordResetEmail } from "firebase/auth";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleReset = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (err) {
      setError(String(err) || "Failed to send reset email");
    }
  };

  return (
    <div>
      <h1>Forgot Password</h1>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={handleReset}>Send Reset Email</button>
      <div>
        <Link to="/login">Back to Login</Link>
      </div>
      {error && <div>{error}</div>}
    </div>
  );
}

export default ForgotPassword;
