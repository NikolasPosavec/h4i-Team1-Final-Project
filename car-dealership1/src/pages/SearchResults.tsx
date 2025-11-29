import Navbar from "../components/navbar";
import type { Car } from "../types";
import { useLocation } from "react-router-dom";
import CarCard from "../components/CarCard";

type SearchResultsLocationState = {
  query: [string, string, number, number];
  results: Car[];
};

const SearchResults = () => {
  const location = useLocation();
  const { query, results } = location.state as SearchResultsLocationState;

  // Join the truthy values of the query array into a string with spaces
  const queryString = query.filter(Boolean).join(" ");

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold my-8">
          Search Results for: {queryString}
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {results.map((result) => (
            <CarCard key={result.id} car={result} />
          ))}
        </div>
      </div>
    </>
  );
};

export default SearchResults;
