import React, { useState, useEffect } from "react";
import { db } from "../firebase/config";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
} from "firebase/firestore";
import type { Car } from "../types";
import Navbar from "../components/navbar";
import CarCard from "../components/CarCard";

const Vendor = () => {
  const [cars, setCars] = useState<Car[]>([]);
  type NewCar = {
    make: string;
    model: string;
    year: number | null;
    price: number | null;
    mileage: number | null;
    trim: string;
    image_url: string;
    color: string;
    seats: number | null;
    drivetrain: string;
  };

  const [newCar, setNewCar] = useState<NewCar>({
    make: "",
    model: "",
    year: null,
    price: null,
    mileage: null,
    trim: "",
    image_url: "",
    color: "",
    seats: null,
    drivetrain: "",
  });
  const [editingCar, setEditingCar] = useState<Car | null>(null);

  const fetchCars = async () => {
    try {
      const snapshot = await getDocs(collection(db, "cars"));
      const carsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Car[];
      setCars(carsData);
    } catch (err) {
      alert("Error (fetching)" + err);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  {
    /**adds a new car to the firebase inventory */
  }
  const handleAddCar = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "cars"), {
        color: newCar.color,
        drivetrain: newCar.drivetrain,
        image_url: newCar.image_url,
        make: newCar.make,
        mileage: newCar.mileage,
        model: newCar.model,
        price: newCar.price,
        seats: newCar.seats,
        trim: newCar.trim,
        year: newCar.year,
      });
      setNewCar({
        make: "",
        model: "",
        year: 2000,
        price: 0,
        mileage: 0,
        trim: "",
        image_url: "",
        color: "",
        seats: 0,
        drivetrain: "",
      });
      fetchCars();
      alert("Car added successfully");
    } catch (err) {
      alert("Error (adding)" + err);
    }
  };

  {
    /**For editing existing cars in the inventory*/
  }
  const handleEditCar = (car: Car) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setEditingCar(car);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCar) return;

    try {
      await updateDoc(doc(db, "cars", editingCar.id), {
        color: editingCar.color,
        drivetrain: editingCar.drivetrain,
        image_url: editingCar.image_url,
        make: editingCar.make,
        mileage: editingCar.mileage,
        model: editingCar.model,
        price: editingCar.price,
        seats: editingCar.seats,
        trim: editingCar.trim,
        year: editingCar.year,
      });
      setEditingCar(null);
      fetchCars();
      alert("Car updated successfully");
    } catch (err) {
      alert("Error (updating)" + err);
    }
  };

  {
    /**Deletes a car from the inventory */
  }
  const handleDeleteCar = async (id: string) => {
    if (
      window.confirm(
        "Are you sure you want to commit to deleting this car? (This action cannot be undone.)"
      )
    ) {
      try {
        await deleteDoc(doc(db, "cars", id));
        fetchCars();
        alert("Car deleted successfully");
      } catch (err) {
        alert("Error (deleting)" + err);
      }
    }
  };

  return (
    <div>
      {/**nav bar with all the default links and buttons */}
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Vendor Inventory Dashboard</h1>

        {/* Add/Edit Car Form */}
        <form
          onSubmit={editingCar ? handleSaveEdit : handleAddCar}
          className="mb-8 space-y-4"
        >
          <input
            type="text"
            placeholder="Make"
            value={editingCar ? editingCar.make : newCar.make}
            onChange={(e) =>
              editingCar
                ? setEditingCar({ ...editingCar, make: e.target.value })
                : setNewCar({ ...newCar, make: e.target.value })
            }
            className="border p-2 w-full"
          />
          <input
            type="text"
            placeholder="Model"
            value={editingCar ? editingCar.model : newCar.model}
            onChange={(e) =>
              editingCar
                ? setEditingCar({ ...editingCar, model: e.target.value })
                : setNewCar({ ...newCar, model: e.target.value })
            }
            className="border p-2 w-full"
          />
          <input
            type="number"
            placeholder="Year"
            value={editingCar ? editingCar.year : newCar.year ?? ""}
            onChange={(e) =>
              editingCar
                ? setEditingCar({ ...editingCar, year: Number(e.target.value) })
                : setNewCar({
                    ...newCar,
                    year: e.target.value === "" ? null : Number(e.target.value),
                  })
            }
            className="border p-2 w-full"
          />

          <input
            type="number"
            placeholder="Price"
            value={editingCar ? editingCar.price : newCar.price ?? ""}
            onChange={(e) =>
              editingCar
                ? setEditingCar({
                    ...editingCar,
                    price: Number(e.target.value),
                  })
                : setNewCar({
                    ...newCar,
                    price:
                      e.target.value === "" ? null : Number(e.target.value),
                  })
            }
            className="border p-2 w-full"
          />

          <input
            type="number"
            placeholder="Mileage"
            value={editingCar ? editingCar.mileage : newCar.mileage ?? ""}
            onChange={(e) =>
              editingCar
                ? setEditingCar({
                    ...editingCar,
                    mileage: Number(e.target.value),
                  })
                : setNewCar({
                    ...newCar,
                    mileage:
                      e.target.value === "" ? null : Number(e.target.value),
                  })
            }
            className="border p-2 w-full"
          />

          <input
            type="text"
            placeholder="Trim"
            value={editingCar ? editingCar.trim : newCar.trim}
            onChange={(e) =>
              editingCar
                ? setEditingCar({ ...editingCar, trim: e.target.value })
                : setNewCar({ ...newCar, trim: e.target.value })
            }
            className="border p-2 w-full"
          />

          <input
            type="text"
            placeholder="Image URL"
            value={editingCar ? editingCar.image_url : newCar.image_url}
            onChange={(e) =>
              editingCar
                ? setEditingCar({ ...editingCar, image_url: e.target.value })
                : setNewCar({ ...newCar, image_url: e.target.value })
            }
            className="border p-2 w-full"
          />

          <input
            type="text"
            placeholder="Color"
            value={editingCar ? editingCar.color : newCar.color}
            onChange={(e) =>
              editingCar
                ? setEditingCar({ ...editingCar, color: e.target.value })
                : setNewCar({ ...newCar, color: e.target.value })
            }
            className="border p-2 w-full"
          />

          <input
            type="text"
            placeholder="Drivetrain"
            value={editingCar ? editingCar.drivetrain : newCar.drivetrain}
            onChange={(e) =>
              editingCar
                ? setEditingCar({ ...editingCar, drivetrain: e.target.value })
                : setNewCar({ ...newCar, drivetrain: e.target.value })
            }
            className="border p-2 w-full"
          />

          <input
            type="text"
            placeholder="Seats"
            value={editingCar ? editingCar.seats : newCar.seats ?? ""}
            onChange={(e) =>
              editingCar
                ? setEditingCar({
                    ...editingCar,
                    seats: Number(e.target.value),
                  })
                : setNewCar({
                    ...newCar,
                    seats:
                      e.target.value === "" ? null : Number(e.target.value),
                  })
            }
            className="border p-2 w-full"
          />

          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            {editingCar ? "Save Changes" : "Add Car"}
          </button>
          {editingCar && (
            <button
              type="button"
              className="ml-2 bg-gray-500 text-white px-4 py-2 rounded"
              onClick={() => setEditingCar(null)}
            >
              Cancel
            </button>
          )}
        </form>

        {/* the car card per car in the inventory */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cars.map((car) => (
            <div key={car.id} className="flex flex-col">
              <CarCard car={car} />
              <div className="mt-2 flex space-x-2">
                <button
                  onClick={() => handleEditCar(car)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteCar(car.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Vendor;
