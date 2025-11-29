import Navbar from "../components/navbar";
import { FaInstagramSquare } from "react-icons/fa";
import { RiFacebookBoxFill } from "react-icons/ri";
import { FaSquareXTwitter } from "react-icons/fa6";
import { FaYoutube } from "react-icons/fa";
import { useState } from "react";
import { db } from "../firebase/config";
import { collection, addDoc } from "firebase/firestore";

function Contact() {
  const [message, setMessage] = useState({
    firstName: "",
    lastName: "",
    emailAddress: "",
    phoneNumber: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const messageRef = collection(db, "messages");
      await addDoc(messageRef, { ...message });

      setMessage({
        firstName: "",
        lastName: "",
        emailAddress: "",
        phoneNumber: "",
        message: "",
      });

      alert("The message was sent.");
    } catch (err) {
      alert("Failed to send the message, please try again" + err);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Send Message Form */}
          <div className="bg-gray-100 rounded-2xl border-4 border-gray-800 p-8">
            <h2 className="text-2xl font-bold text-center mb-6">
              SEND US A MESSAGE
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="firstName" className="block font-medium text-sm mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  value={message.firstName}
                  onChange={(e) =>
                    setMessage({ ...message, firstName: e.target.value })
                  }
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-gray-400"
                  required
                />
              </div>

              <div>
                <label htmlFor="lastName" className="block font-medium text-sm mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  value={message.lastName}
                  onChange={(e) =>
                    setMessage({ ...message, lastName: e.target.value })
                  }
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-gray-400"
                  required
                />
              </div>

              <div>
                <label htmlFor="emailAddress" className="block font-medium text-sm mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="emailAddress"
                  value={message.emailAddress}
                  onChange={(e) =>
                    setMessage({ ...message, emailAddress: e.target.value })
                  }
                  placeholder="thebestdealer@gmail.com"
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-gray-400"
                  required
                />
              </div>

              <div>
                <label htmlFor="phoneNumber" className="block font-medium text-sm mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  value={message.phoneNumber}
                  onChange={(e) =>
                    setMessage({ ...message, phoneNumber: e.target.value })
                  }
                  placeholder="(123) 123-1234"
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-gray-400"
                  required
                />
              </div>

              <div>
                <label htmlFor="message" className="block font-medium text-sm mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  value={message.message}
                  onChange={(e) =>
                    setMessage({ ...message, message: e.target.value })
                  }
                  placeholder="Tell us how we can help you..."
                  rows={4}
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-gray-400 resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-full transition-colors duration-200"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="bg-gray-100 rounded-2xl border-4 border-gray-800 p-8">
            <h2 className="text-2xl font-bold text-center mb-6">
              CONTACT INFORMATION
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Address */}
              <div className="bg-yellow-400 rounded-xl border-2 border-gray-800 p-5">
                <h3 className="text-lg font-bold mb-2">Address</h3>
                <p className="text-sm leading-relaxed">
                  ShellFax Car Dealership<br />
                  4131 Campus Dr<br />
                  College Park, MD, 20742
                </p>
                <a
                  href="https://maps.google.com"
                  className="text-red-600 font-semibold text-sm mt-2 inline-block hover:underline"
                >
                  Get Directions
                </a>
              </div>

              {/* Phone Numbers */}
              <div className="bg-yellow-400 rounded-xl border-2 border-gray-800 p-5">
                <h3 className="text-lg font-bold mb-2">Phone Numbers</h3>
                <p className="text-sm leading-relaxed">
                  <strong>Sales:</strong> (800)-123-4567<br />
                  <strong>Service:</strong> (800)-737-8423<br />
                  <strong>Parts:</strong> (800)-123-7278<br />
                  <strong>Finance:</strong> (800)-346-2623
                </p>
              </div>

              {/* Email Addresses */}
              <div className="bg-yellow-400 rounded-xl border-2 border-gray-800 p-5">
                <h3 className="text-lg font-bold mb-2">Email Addresses</h3>
                <p className="text-sm leading-relaxed">
                  <strong>General:</strong> info@shellfax.com<br />
                  <strong>Sales:</strong> sales@shellfax.com<br />
                  <strong>Parts:</strong> parts@shellfax.com<br />
                  <strong>Finance:</strong> finance@shellfax.com
                </p>
              </div>

              {/* Connect With Us */}
              <div className="bg-yellow-400 rounded-xl border-2 border-gray-800 p-5">
                <h3 className="text-lg font-bold mb-3">Connect With Us</h3>
                <div className="grid grid-cols-2 gap-3">
                  <a
                    href="https://www.facebook.com/login.php/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center bg-blue-600 rounded-lg p-2 hover:opacity-80 transition-opacity"
                  >
                    <RiFacebookBoxFill color="white" size={40} />
                  </a>
                  <a
                    href="https://www.instagram.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 rounded-lg p-2 hover:opacity-80 transition-opacity"
                  >
                    <FaInstagramSquare color="white" size={40} />
                  </a>
                  <a
                    href="https://x.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center bg-black rounded-lg p-2 hover:opacity-80 transition-opacity"
                  >
                    <FaSquareXTwitter color="white" size={40} />
                  </a>
                  <a
                    href="https://www.youtube.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center bg-red-600 rounded-lg p-2 hover:opacity-80 transition-opacity"
                  >
                    <FaYoutube color="white" size={40} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;