import Navbar from "../components/navbar";
import {useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase/config";
import { doc, getDoc, setDoc } from "firebase/firestore";

type UserData = {
    firstName:string;
    lastName: string;
    email:string; 
    phoneNumber:string;
}

function Customer() {
    const navigate = useNavigate();
    const [user, setUser] = useState(auth.currentUser);
    const [userData, setUserData] = useState<UserData | null>(null);
    const [editing, setEditing] = useState(false);

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");

    useEffect(() => {
        const listen = auth.onAuthStateChanged(async (currentUser) => {
            setUser(currentUser);

            if(!currentUser){
                navigate("/login");
            } else{
                try{
                    const userDoc = await getDoc(doc(db, "users", currentUser.uid));
                    if(userDoc.exists()){
                        const data = userDoc.data();
                        setUserData(data as UserData);
                        setFirstName(data.firstName || "");
                        setLastName(data.lastName || "");
                        setPhoneNumber(data.phoneNumber || "");
                    } else{
                        setUserData({
                            firstName: "",
                            lastName: "",
                            email: currentUser.email || "",
                            phoneNumber: ""
                        });
                    }
                } catch (error){
                    console.error("Error fetching user data:", error);
                }
            }
        });

        return () => listen();
    },[navigate]);

    const handleSaveProfile = async () => {
        if (!user) return;
        
        try{
            await setDoc(doc(db, "users", user.uid),{
                firstName:firstName, 
                lastName:lastName,
                email:user.email || "",
                phoneNumber:phoneNumber,
                updatedAt: new Date()
            });

            setUserData({
                firstName: firstName, 
                lastName: lastName, 
                email: user.email || "", 
                phoneNumber:phoneNumber
            });
            setEditing(false);
        }catch(error){
            console.error("Error saving profile:", error);
        }
    };

    if (!user){
        return null;
    }

  return (
    <>
    <div className="min-h-screen bg-white">
         <Navbar />
        <div className = "container mx-auto px-4 py-8">  
            <h1 className="text-4xl font-bold text-center mb-8">Welcome Back!</h1>
        </div> 
        <div className="max-w-2xl mx-auto bg-white rounded-2xl border-4 border-gray-800 p-12 text-center">
            <div className = "flex justify-between items-center mb-6"> 
            <h2 className = "text-3xl font-bold mb-4 text-left"> Your Profile: </h2>
            {!editing && (
                <button onClick={() => setEditing(true)} 
                className = "bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-2 px-6 rounded-lg transition-colors">
                    Edit Profile
                </button>
            )}
            </div>

            {editing ? (
                <div className = "space-y-4">
                    <div className = "grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className = "block font-medium text-sm mb-2">First Name:</label>
                            <input
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            placeholder = "Enter first name"
                            className = "w-full px-3 py-2 border-2 border-gray-300 rounded-lg bg-white"
                            />
                        </div>

                        <div>
                            <label className = "block font-medium text-sm mb-2">Last Name:</label>
                            <input
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            placeholder = "Enter last name"
                            className = "w-full px-3 py-2 border-2 border-gray-300 rounded-lg bg-white"
                            />
                        </div>
                    </div>

                    <div>
                        <label className = "block text-sm font-medium mb-2">Email:</label>
                        <input 
                        type="email" 
                        value={user.email || ""} 
                        disabled 
                        className = "w-full px-3 py-2 border-2 border-gray-300 rounded-lg bg-gray-300 text-gray-600 cursor-not-allowed"
                        />
                        <p className = "text-xs text-gray-600 mt-1">Email cannot be changed (used for login)</p>
                    </div>

                    <div>
                        <label className = "block text-sm font-medium mb-2">Phone Number:</label>
                        <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="XXX-XXX-XXXX"
                        className = "w-full px-3 py-2 border-2 border-gray-300 rounded-lg bg-white"
                        />
                    </div>


                    <div className = "flex gap-3 pt-4">
                        <button 
                        onClick={handleSaveProfile} 
                        className = "flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-colors">
                            Save Profile
                        </button>
                        {userData && (
                            <button
                            onClick={() => {
                                setEditing(false);
                                setFirstName(userData.firstName || "");
                                setLastName(userData.lastName || "");
                                setPhoneNumber(userData.phoneNumber || "");
                            }}
                            className = "flex-1 bg-gray-800 hover:bg-gray-900 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                            >
                            Cancel
                            </button>
                        )}
                    </div>
                </div>
                    ) : (
                        userData && (
                        <div className = "space-y-4 text-left">
                            <div className = "grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p className = "block text-sm font-medium">First Name:</p>
                                    <p className = "text-gray-700 mb-2"> {userData.firstName || "Not provided"}</p>
                                </div>
                                <div>
                                    <p className = "block text-sm font-medium">Last Name: </p>
                                    <p className = "text-gray-700 mb-2">{userData.lastName || "Not provided"}</p>
                                </div>
                            </div>
                            <div>
                                <p className = "block text-sm font-medium">Email: </p>
                                <p className = "text-gray-700 mb-2">{userData.email}</p>
                            </div>
                            <div>
                                <p className = "block text-sm font-medium">Phone Number: </p>
                                <p className = "text-gray-700 mb-2">{userData.phoneNumber || "Not provided"}</p>
                            </div>
                        </div>
                        )
                    )}
        </div>

    </div>
    </>
  );
}

export default Customer;
