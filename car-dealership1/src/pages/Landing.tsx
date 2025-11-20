import { useState } from 'react';
import { signOut } from "firebase/auth";
import { auth } from "../firebase/config";

function LandingPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    // function to handle user logging out
    const handleLogout = async () => {
        try {
            await signOut(auth);
        } catch (err) {
            console.error("Logout error:", err);
        }
    };

    /* function to make search bar functional, should we display results on this page?
        or make a new one or it doesnt matter? */
    const processSearch = async () => {
        if (!searchTerm.trim()) return;
        
        setLoading(true);
        
        try {
            const response = await fetch(
                `APILINK=${searchTerm}`, // NEED TO ADD API LINK AND DECIDE WHICH WE WANT TO USE
                { headers: { 'Accept': 'application/json' } }
            );
            const data = await response.json();
            setResults(data.results); // GONNA DEPEND ON WHICH API WE CHOOSE
        } catch (error) {
            console.error("Something went wrong -", error);
            setResults([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8">
            {/* header with logout button */}
            <div className="flex justify-end items-center mb-8">
                <button 
                    type="button"
                    onClick={handleLogout}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                    Logout
                </button>
            </div>

            {/* search bar */}
            <div className="flex gap-2">
                <input 
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && processSearch()}
                    placeholder="Search cars..."
                    className="border border-gray-300 rounded px-4 py-2 w-80"
                />
                <button 
                    onClick={processSearch} 
                    className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                >
                    {loading ? 'Searching...' : 'Search'}
                </button>
            </div>

            {/* RESULTS DISPLAYED HERE */}
            {results.length > 0 && (
                <div className="mt-6">
                    {results.map((item, index) => (
                        <div key={index} className="border p-4 mb-2 rounded">
                            {JSON.stringify(item)}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default LandingPage;
