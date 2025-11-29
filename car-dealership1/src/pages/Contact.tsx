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
  })





  const handleSubmit = async (e: React.FormEvent) => {
    {/**the event handler to prevent the site from refreshing and necrssary for the message to actually submit and send to the firestore*/}
    e.preventDefault();

    try {
        {/*the reference to the messages collection in Firestore */}
        const messageRef = collection(db, "messages");

        {/**takes the message and stores it into the messages collection */}
        await addDoc(messageRef, {...message});
        


        {/**resets the form fields after submitting the message so the form is cleared for a new message */}
        setMessage({
          firstName: "",
          lastName: "",
          emailAddress: "",
          phoneNumber: "",
          message: "",
        });

        alert("The message was sent.");

      {/**catches any errors that might occur during the message submission */}
      } catch (err) {
        alert("Failed to send the message, please try again" + err);
      }
    }


  return (
      <div>
      {/**div section for the navbar, so that it doesn't get mixed with the rest of the grid styling */}
      <Navbar />
      <div className="flex">
      <div className="bg-gray-200 shadow-xl p-25 m-5 rounded-lg">
         {/**the section for the user to send a message to the dealership, in other words, us */}
         <h2 className="text-center text-2xl font-bold">SEND US A MESSAGE</h2>
         <form onSubmit={handleSubmit}>

        {/**input field for the first name */}
         <div>
          <label htmlFor="firstName" className="block font-semibold">First Name:</label>
          <input
            type="text"
            id="firstName"
            value={message.firstName}
            onChange={(e) => setMessage({ ...message, firstName: e.target.value })}
            className="border border-black rounded mb-4 w-full"
          />
        </div>

        {/**input field for the last name */}
        <div>
          <label htmlFor="lastName" className="block font-semibold">Last Name:</label>
          <input
            type="text"
            id="lastName"
            value={message.lastName}
            onChange={(e) => setMessage({ ...message, lastName: e.target.value })}
            className="border border-black rounded mb-4 w-full"
          />
        </div>


        {/**input field for the email address */}
        <div>
          <label htmlFor="emailAddress" className="block font-semibold">Email Address:</label>
          <input
            type="email"
            id="emailAddress"
            value={message.emailAddress}
            onChange={(e) => setMessage({ ...message, emailAddress: e.target.value })}
            className="border border-black rounded mb-4 w-full"
          />
        </div>

      {/**input field for the phone number */}
        <div>
          <label htmlFor="phoneNumber" className="block font-semibold">Phone Number:</label>
          <input
            type="phone"
            id="phoneNumber"
            value={message.phoneNumber}
            onChange={(e) => setMessage({ ...message, phoneNumber: e.target.value })}
            className="border border-black rounded mb-4 w-full"
          />
        </div>


      {/**input field for the actual message */}
        <div>
          <label htmlFor="message" className="block font-semibold ">Message:</label>
          <input
            type="text"
            id="message"
            value={message.message}
            onChange={(e) => setMessage({ ...message, message: e.target.value })}
            className="border border-black rounded mb-4 w-full"
          />
        </div>

        <button type="submit" className="bg-red-500 text-white font-bold py-2 px-2 rounded">
          Send Message
        </button>

         </form>
      </div>












      {/**The contact us information section*/}
      <div className="bg-gray-200 shadow-xl p-5 m-5 rounded-lg">
        <h2 className="text-center text-2xl font-bold">CONTACT INFORMATION</h2>
      {/**gray backgroun in a grid layout. The gri has 2 columns per row. Added a padding around the frame and a gap between each individual block element.  */}
      <div className= "grid grid-cols-2 p-5 gap-5 rounded-lg">
    
        {/**block for the address*/}
        <div className="bg-yellow-400 rounded-lg shadow-xl p-5">
          <h2 className="text-xl font-semibold">Address</h2>
          <p>ShellFax Car Dealership</p>
          <p>4131 Campus Dr</p>
          <p>College Park, MD, 20742</p>
        </div>

        {/**block for the phone number*/}
         <div className="bg-yellow-400 rounded-lg shadow-xl p-5">
          <h2 className="text-xl font-semibold">Phone Numbers</h2>
          <p>Sales: (800)-123-4567</p>
          <p>Service: (800)-737-8423</p>
          <p>Parts: (800)-123-7278</p>  
          <p>Finance: (800)-346-2623</p>
        </div>

        {/**block for the email addresses*/}
        <div className="bg-yellow-400 rounded-lg shadow-xl p-5">
          <h2 className="text-xl font-semibold">Email Adresses</h2>
          <p>General: info@shellfax.com</p>
          <p>Sales: sales@shellfax.com</p>
          <p>Parts: parts@shellfax.com</p>
          <p>Finance: finance@shellfax.com</p>
        </div>

        {/**block for connect*/}
        <div className="bg-yellow-400 rounded-lg shadow-xl p-5 ">
          <h2 className="text-xl font-semibold">Connect With Us</h2>
          <div className="grid grid-cols-2 p-5 gap-5">
          {/**Made working links to the icons but it just links to the login pages */}
          <a href="https://www.facebook.com/login.php/"><RiFacebookBoxFill color="blue" size={60} /></a>
          <a href="https://www.instagram.com/"><FaInstagramSquare color="orange"  size={60} /></a>
          <a href="https://x.com/"><FaSquareXTwitter size={60} /></a>
          <a href="https://www.youtube.com/"><FaYoutube color="red" size={60} /></a>
         
          
          
         
          
         
          </div>
        </div>




          </div>

        </div>
        </div>
      </div>
  );
}

export default Contact;
