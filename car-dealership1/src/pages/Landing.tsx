import { useState, useEffect } from "react";
import { collection, getDocs, query, limit } from "firebase/firestore";
import { db } from "../firebase/config";
import SearchBar from "../components/SearchBar";
import Navbar from "../components/navbar";

import shellfaxLogo from "../assets/images/shellfax-logo.png";
import moneyIcon from "../assets/images/money-icon.png";
import trophyIcon from "../assets/images/trophy-icon.png";
import peopleIcon from "../assets/images/people-icon.png";
import checkmarkIcon from "../assets/images/checkmark-icon.png";
import starsIcon from "../assets/images/stars-icon.png";
import userIcon from "../assets/images/user-icon.png";

function LandingPage() {
  const [featuredCar, setFeaturedCar] = useState<any>(null);
  const [suggestedCars, setSuggestedCars] = useState<any[]>([]);
  const [carsLoading, setCarsLoading] = useState(true);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        setCarsLoading(true);
        const carsCollection = collection(db, "cars");
        const carsQuery = query(carsCollection, limit(4));
        const querySnapshot = await getDocs(carsQuery);

        const cars: any[] = [];
        querySnapshot.forEach((doc) => {
          cars.push({ id: doc.id, ...doc.data() });
        });

        if (cars.length > 0) {
          setFeaturedCar(cars[0]);
          setSuggestedCars(cars.slice(1, 4));
        }
      } catch (error) {
        console.error("Error fetching cars:", error);
      } finally {
        setCarsLoading(false);
      }
    };

    fetchCars();
  }, []);

  const reviews = [
    {
      name: "Anonymous Review",
      text: "I've bought cars from other places before, but this dealership truly stands out. The staff was knowledgeable, patient, and helped me make the best decision. I left with my dream car and complete confidence in my purchase.",
      rating: 5,
    },
    {
      name: "Jordan Mitchell",
      text: "From pricing to service, everything was transparent and smooth. They walked me through every step and made sure I understood all my options. Easily the most stress-free car-buying experience I've ever had.",
      rating: 5,
    },
    {
      name: "Ariana Collins",
      text: "Exceptional service from start to finish. The team listened to what I needed, found the perfect vehicle, and handled everything quickly. Highly recommend them to anyone looking for quality and reliability.",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Navbar */}
      <Navbar />

      {/* Featured Car Section */}
      <section className="bg-white">
        <div className="container mx-auto px-4 py-12">
          {carsLoading ? (
            <div className="text-center py-20">
              <p className="text-2xl text-gray-600">Loading featured car...</p>
            </div>
          ) : featuredCar ? (
            <div className="grid lg:grid-cols-2 gap-8 items-stretch">
              {/* Featured Car Image */}
              <div className="border-4 border-gray-900 p-8 bg-gray-100 h-full flex items-center justify-center">
                <img
                  src={
                    featuredCar.image_url ||
                    "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=600&h=400&fit=crop"
                  }
                  alt={`${featuredCar.year} ${featuredCar.make} ${featuredCar.model}`}
                  className="w-full h-auto rounded-lg shadow-md"
                />
              </div>

              {/* Featured Car Details */}
              <div className="bg-yellow-400 p-8 rounded-lg h-full flex flex-col">
                <h2 className="text-5xl font-bold text-gray-900 mb-4">
                  {featuredCar.year} {featuredCar.make} {featuredCar.model}
                </h2>

                <p className="text-gray-900 mb-6 leading-relaxed text-3xl">
                  This {featuredCar.year} {featuredCar.make} {featuredCar.model}{" "}
                  offers a smooth and efficient driving experience with its{" "}
                  {featuredCar.trim || "well-equipped design"}. With only{" "}
                  {featuredCar.mileage?.toLocaleString()} miles, it's been
                  lightly driven and well-maintained, making it an excellent
                  choice for commuters or first-time buyers. Finished in{" "}
                  {featuredCar.color}, it delivers reliability, comfort, and
                  great fuel economy without breaking the bank.
                </p>
                <p className="text-5xl font-bold text-red-600 mt-auto">
                  ${featuredCar.price?.toLocaleString()}
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-2xl text-gray-600">
                No featured car available
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Search Bar */}
      <SearchBar />

      {/* Featured & Suggested Cars Section */}
      <section className="bg-yellow-400 py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-8">
            FEATURED & SUGGESTED CARS
          </h2>

          {carsLoading ? (
            <div className="text-center py-10">
              <p className="text-2xl text-gray-800">Loading cars...</p>
            </div>
          ) : suggestedCars.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {suggestedCars.map((car) => (
                <div
                  key={car.id}
                  className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className="p-4 bg-gray-50">
                    <h3 className="text-lg font-bold text-center">
                      {car.year} {car.make} {car.model}
                    </h3>
                  </div>
                  <img
                    src={
                      car.image_url ||
                      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=300&fit=crop"
                    }
                    alt={`${car.year} ${car.make} ${car.model}`}
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-4">
                    <p className="text-gray-700 mb-2">
                      <strong>Price:</strong> ${car.price?.toLocaleString()}
                    </p>
                    <p className="text-gray-700 mb-2">
                      <strong>Mileage:</strong> {car.mileage?.toLocaleString()}{" "}
                      miles
                    </p>
                    <p className="text-gray-700">
                      <strong>Color:</strong> {car.color}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-2xl text-gray-800">
                No suggested cars available
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Why Us Section */}
      <section className="bg-red-600 py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-black mb-12">
            WHY US!
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              {
                title: "AWARD WINNING",
                text: "Recognized for excellence year after year — our award-winning dealership sets the standard for quality and customer satisfaction.",
                icon: trophyIcon,
              },
              {
                title: "MOST RELIABLE",
                text: "Count on every step of the way. From honest guidance to dependable vehicles, reliability is at the heart of everything we do.",
                icon: checkmarkIcon,
              },
              {
                title: "FLEXIBLE PRICING",
                text: "Transparent, competitive pricing with no hidden fees — giving you the best value without the stress.",
                icon: moneyIcon,
              },
              {
                title: "CONSISTENT SERVICE",
                text: "Premium customer service from trained professionals who go the extra mile to keep you moving forward on the road with confidence.",
                icon: peopleIcon,
              },
            ].map((item, index) => (
              <div key={index} className="bg-yellow-400 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-800 text-sm mb-4">{item.text}</p>
                <div className="flex justify-center mt-4">
                  <img
                    src={item.icon}
                    alt={item.title}
                    className="w-24 h-24 object-contain"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Reviews Section */}
          <h2 className="text-4xl font-bold text-center text-black mb-8">
            CUSTOMER REVIEWS
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {reviews.map((review, index) => (
              <div key={index} className="bg-yellow-400 p-6 rounded-lg">
                <h3 className="font-bold text-gray-900 mb-2">{review.name}</h3>
                <p className="text-gray-800 text-sm mb-4">{review.text}</p>
                <div className="flex justify-center gap-1 mb-4">
                  <img src={starsIcon} alt="5 stars" className="h-28 w-auto" />
                </div>
                <div className="flex justify-center mt-4">
                  <img
                    src={userIcon}
                    alt={review.name}
                    className="w-16 h-16 rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <img
              src={shellfaxLogo}
              alt="Shellfax Logo"
              className="h-16 w-auto"
            />
          </div>
          <p className="text-gray-900 font-bold text-xl">© 2025</p>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
