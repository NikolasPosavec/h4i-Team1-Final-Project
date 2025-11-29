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
      <div>
        <Navbar />
        <h1>Welcome Back</h1>
        <p> Email: {user.email}</p>

        <h2> Your Profile: </h2>
        
        {!editing && (
            <button onClick={() => setEditing(true)} className = "border border-black px-3 py-1 mr-2">
                Edit Profile
            </button>
        )}

      {editing ? (
        <div>
            <div>
                <label>First Name:</label>
                <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                />
            </div>

            <div>
                <label>Last Name:</label>
                <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                />
            </div>

            <div>
                <label>Email:</label>
                <input type="email" value={user.email || ""} disabled />
            </div>

            <div>
                <label>Phone Number:</label>
                <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                />
            </div>

            <button onClick={handleSaveProfile} className = "border border-black px-3 py-1 mr-2">
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
                className = "border border-black px-3 py-1 mr-2"
                >
                Cancel
                </button>
            )}
        </div>
      ) : (
        userData && (
          <div>
            <p>First Name: {userData.firstName || "Not provided"}</p>
            <p>Last Name: {userData.lastName || "Not provided"}</p>
            <p>Email: {userData.email}</p>
            <p>Phone Number: {userData.phoneNumber || "Not provided"}</p>
          </div>
        )
      )}
    </div>
    </>
  );
}

export default Customer;
