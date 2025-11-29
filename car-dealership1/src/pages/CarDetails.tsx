import Navbar from "../components/navbar";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import { useState, useEffect } from "react";
import type { Car } from "../types";

export default function CarDetails() {
  const { id } = useParams();

  const [car, setCar] = useState<Car | null>(null);

  useEffect(() => {
    const fetchCar = async () => {
      if (!id) return;

      try {
        const carDocRef = doc(db, "cars", id);
        const carDocSnap = await getDoc(carDocRef);

        if (carDocSnap.exists()) {
          const carData = { id: carDocSnap.id, ...carDocSnap.data() } as Car;
          console.log(carData);
          setCar(carData);
        } else {
          console.log("No car found with id:", id);
          setCar(null);
        }
      } catch (error) {
        console.error("Error fetching car:", error);
        setCar(null);
      }
    };

    fetchCar();
  }, [id]);

  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex-1 flex items-center">
        <div className="container mx-auto px-4 ">
          {car && (
            <div className="flex sm:flex-row flex-col">
              <div className="w-1/2 h-full object-cover border-2 border-yellow-500 rounded-md">
                <img
                  src={car.image_url}
                  alt={car.model}
                  className="object-cover h-full w-full"
                />
              </div>
              <div className="flex flex-col pl-10 w-1/2">
                <h1 className="text-4xl font-bold">
                  {car.year} {car.make} {car.model}
                </h1>
                <p className="text-gray-600 text-xl">{car.trim}</p>
                <div className="flex flex-col">
                  {/* First Row Icons container */}
                  <div className="flex my-4 sm:flex-row flex-col gap-4">
                    <div className="flex items-center w-1/2">
                      <div className="rounded-full p-1 flex items-center justify-center border-2 border-black">
                        <img
                          src="/src/assets/carIcons/mileage.svg"
                          alt="mileage"
                          className="w-10 h-10"
                        />
                      </div>
                      <p className="text-gray-600 text-2xl pl-3">
                        {car.mileage} miles
                      </p>
                    </div>
                    <div className="flex items-center w-1/2">
                      <div className="rounded-full p-1 flex items-center justify-center border-2 border-black">
                        <img
                          src="/src/assets/carIcons/drivetrain.svg"
                          alt="mileage"
                          className="w-10 h-10"
                        />
                      </div>
                      <p className="text-gray-600 text-2xl pl-3">
                        {car.drivetrain}
                      </p>
                    </div>
                  </div>
                  {/* Second Row Icons container */}
                  <div className="flex my-4 sm:flex-row flex-col gap-4">
                    <div className="flex items-center w-1/2">
                      <div className="rounded-full p-1 flex items-center justify-center border-2 border-black">
                        <img
                          src="/src/assets/carIcons/color.svg"
                          alt="color"
                          className="w-10 h-10"
                        />
                      </div>
                      <p className="text-gray-600 text-2xl pl-3">{car.color}</p>
                    </div>
                    <div className="flex items-center w-1/2">
                      <div className="rounded-full p-1 flex items-center justify-center border-2 border-black">
                        <img
                          src="/src/assets/carIcons/seats.svg"
                          alt="seats"
                          className="w-10 h-10"
                        />
                      </div>
                      <p className="text-gray-600 text-2xl pl-3">{`${car.seats} seater`}</p>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-black text-3xl font-bold my-4">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                    }).format(car.price)}
                  </p>
                  <button className="bg-yellow-400 text-xl text-white px-4 py-4 rounded-md">
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
