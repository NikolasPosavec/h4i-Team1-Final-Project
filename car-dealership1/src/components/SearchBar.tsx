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
    try {
      const carsRef = collection(db, "cars");

      // Parse filter values
      const makeFilter = make.trim().toLowerCase();
      const modelFilter = model.trim().toLowerCase();
      const yearNum = year.trim() ? parseInt(year.trim()) : null;
      const priceNum = price.trim() ? parseFloat(price.trim()) : null;

      // Track which filters are applied in Firestore query
      const yearInQuery = yearNum !== null && !isNaN(yearNum);
      const priceInQuery = priceNum !== null && !isNaN(priceNum) && yearInQuery;

      let q;

      /*
      if (yearInQuery) {
        // Year is exact match, so we can combine with price if needed
        if (priceInQuery) {
          q = query(
            carsRef,
            where("year", "==", yearNum),
            where("price", "<=", priceNum)
          );
        } else {
          q = query(carsRef, where("year", "==", yearNum));
        }
      } else if (priceNum !== null && !isNaN(priceNum)) {
        // Only price filter (inequality)
        q = query(carsRef, where("price", "<=", priceNum));
      } else {
        // No numeric filters - get all cars and filter in memory
        q = query(carsRef);
      }
        */

      q = query(
        carsRef,
        where("make", makeFilter ? "==" : ">=", makeFilter),
        where("model", modelFilter ? "==" : ">=", modelFilter),
        where("year", yearNum ? "==" : "!=", yearNum || null),
        where("price", priceNum ? "<=" : ">", priceNum || null)
      );

      const querySnapshot = await getDocs(q);
      let results: Car[] = [];

      querySnapshot.forEach((doc) => {
        const car = doc.data() as Car;
        results.push(car);
      });

      setSearchResults(results);
      console.log(`Found ${results.length} cars matching search criteria`);
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
