import { useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";
import type { Car } from "../types";
import { useNavigate } from "react-router-dom";

const SearchBar = () => {
  const [year, setYear] = useState("");
  const [price, setPrice] = useState("");
  const [model, setModel] = useState("");
  const [make, setMake] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async () => {
    setIsSearching(true);
    let results: Car[] = [];

    // Parse filter values
    const makeLower = make.trim().toLowerCase();
    const makeFilter = make
      ? makeLower.charAt(0).toUpperCase() + makeLower.slice(1)
      : "";
    const modelLower = model.trim().toLowerCase();
    const modelFilter = model
      ? modelLower.charAt(0).toUpperCase() + modelLower.slice(1)
      : "";
    const yearNum = parseInt(year.trim());
    const priceNum = parseFloat(price.trim());

    if (!makeFilter && !modelFilter && !yearNum && !priceNum) {
      alert("Please enter at least one search criteria");
      setIsSearching(false);
      navigate("/");
      return;
    }

    try {
      const carsRef = collection(db, "cars");

      let q: any = carsRef;
      if (makeFilter) q = query(q, where("make", "==", makeFilter));
      if (modelFilter) q = query(q, where("model", "==", modelFilter));
      if (yearNum) q = query(q, where("year", "==", yearNum));
      if (priceNum) q = query(q, where("price", "<=", priceNum));

      const querySnapshot = await getDocs(q);

      results = querySnapshot.docs.map((doc) => ({
        ...(doc.data() as Car),
        id: doc.id,
      }));
    } catch (error) {
      console.error("Error searching cars:", error);
      results = [];
    } finally {
      setIsSearching(false);
      navigate("/searchresults", {
        state: {
          query: [makeFilter, modelFilter, priceNum, yearNum],
          results: results,
        },
      });
    }
  };

  const searchEntryData = [
    { value: make, set: setMake, placeholder: "CAR MAKE" },
    { value: model, set: setModel, placeholder: "CAR MODEL" },
    { value: price, set: setPrice, placeholder: "PRICE" },
    { value: year, set: setYear, placeholder: "YEAR" },
  ];

  return (
    <>
      <section className="bg-red-600 py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-black mb-8">
            FIND THE CAR FOR YOU TODAY!
          </h2>

          <div className="flex flex-wrap justify-center gap-4 mb-6">
            {searchEntryData.map((input, index) => (
              <div key={index} className="relative">
                <input
                  type="text"
                  value={input.value}
                  onChange={(e) => input.set(e.target.value)}
                  placeholder={input.placeholder}
                  className="bg-yellow-400 text-gray-900 placeholder-gray-700 px-6 py-3 pr-12 rounded-full w-48 font-medium uppercase"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xl">
                  🔍
                </span>
              </div>
            ))}
          </div>

          <div className="flex justify-center">
            <div className="relative w-full max-w-md">
              <button
                onClick={handleSearch}
                disabled={isSearching}
                className="w-full p-2 my-6 rounded-2xl bg-yellow-300 focus:outline-none focus:ring-1 focus:ring-black text-black disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSearching ? "SEARCHING..." : "SEARCH FOR YOUR DREAM CAR"}
              </button>
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xl">
                🔍
              </span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default SearchBar;
