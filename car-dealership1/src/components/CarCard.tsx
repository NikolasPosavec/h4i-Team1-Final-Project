import type { Car } from "../types";
import { useNavigate } from "react-router-dom";

export default function CarCard({ car }: { car: Car }) {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-lg shadow-md p-4 border-2 border-yellow-500">
      <h2 className="text-2xl font-bold">
        {car.make} {car.model}
      </h2>
      <p className="text-gray-600">{car.trim}</p>
      <img
        src={car.image_url}
        alt={car.model}
        className="w-full h-48 object-contain rounded-lg"
      />
      <div className="flex justify-between mt-5">
        <p className="text-gray-600 text-2xl font-bold">
          {new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(car.price)}
        </p>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
          onClick={() => navigate(`/car/${car.id}`)}
        >
          View Details
        </button>
      </div>
    </div>
  );
}
