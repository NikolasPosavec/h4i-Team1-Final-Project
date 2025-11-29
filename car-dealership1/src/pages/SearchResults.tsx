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

  const formattedPrice = query[2]
    ? new Intl.NumberFormat("en-US", {
        style: "decimal",
        maximumFractionDigits: 0,
      }).format(query[2])
    : "";

  const queryString = `${query[3] ? query[3] : ""} ${query[0]} ${query[1]} ${
    formattedPrice ? `$${formattedPrice}` : ""
  }`;

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold my-8">
          Search Results for: {queryString}
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2 mb-8">
          {results.map((result) => (
            <CarCard key={result.id} car={result} />
          ))}
        </div>
      </div>
    </>
  );
};

export default SearchResults;
