import { useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";

interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  trim: string;
  color: string;
  price: number;
  mileage: number;
  seats: number;
  drivetrain: string;
  image_url: string;
}

const SearchBar = () => {
  const [year, setYear] = useState("");
  const [price, setPrice] = useState("");
  const [model, setModel] = useState("");
  const [make, setMake] = useState("");
  const [searchResults, setSearchResults] = useState<Car[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    setIsSearching(true);
    // Clear previous results immediately
    setSearchResults([]);

    try {
      const carsRef = collection(db, "cars");

      setYear("");
      setPrice("");
      setModel("");
      setMake("");

      // Parse filter values
      const makeLower = make.trim().toLowerCase();
      const makeFilter = make
        ? makeLower.charAt(0).toUpperCase() + makeLower.slice(1)
        : null;
      const modelLower = model.trim().toLowerCase();
      const modelFilter = model
        ? modelLower.charAt(0).toUpperCase() + modelLower.slice(1)
        : null;
      const yearNum = parseInt(year.trim());
      const priceNum = parseFloat(price.trim());

      let q: any = carsRef;
      if (makeFilter) q = query(q, where("make", "==", makeFilter));
      if (modelFilter) q = query(q, where("model", "==", modelFilter));
      if (yearNum) q = query(q, where("year", "==", yearNum));
      if (priceNum) q = query(q, where("price", "<=", priceNum));

      const querySnapshot = await getDocs(q);

      const results = querySnapshot.docs.map((doc) => ({
        ...(doc.data() as Car),
        id: doc.id,
      }));

      setSearchResults(results);
      console.log(results);
    } catch (error) {
      console.error("Error searching cars:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="flex flex-col items-center min-w-full my-7 bg-red-500">
      <h1 className="text-2xl font-bold mt-4">Find The Car For You Today!</h1>
      <div className="flex flex-row items-center justify-around min-w-full">
        <input
          type="text"
          placeholder="CAR MAKE"
          className="w-2xs p-2 my-6 rounded-full bg-yellow-500 focus:outline-none focus:ring-1 focus:ring-black"
          id="make"
          name="make"
          value={make}
          onChange={(e) => setMake(e.target.value)}
        />
        <input
          type="text"
          placeholder="CAR MODEL"
          className="w-2xs p-2 my-6 rounded-full bg-yellow-500 focus:outline-none focus:ring-1 focus:ring-black"
          id="model"
          name="model"
          value={model}
          onChange={(e) => setModel(e.target.value)}
        />
        <input
          type="text"
          placeholder="PRICE"
          className="w-2xs p-2 my-6 rounded-full bg-yellow-500 focus:outline-none focus:ring-1 focus:ring-black"
          id="price"
          name="price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <input
          type="text"
          placeholder="YEAR"
          className="w-2xs p-2 my-6 rounded-full bg-yellow-500 focus:outline-none focus:ring-1 focus:ring-black"
          id="year"
          name="year"
          value={year}
          onChange={(e) => setYear(e.target.value)}
        />
      </div>
      <button
        onClick={handleSearch}
        disabled={isSearching}
        className="w-xl p-2 my-6 rounded-2xl bg-yellow-500 focus:outline-none focus:ring-1 focus:ring-black text-black disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSearching ? "SEARCHING..." : "SEARCH FOR YOUR DREAM CAR"}
      </button>
      {searchResults.length > 0 && (
        <div className="mt-4 text-white">
          <p>Found {searchResults.length} car(s)</p>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
