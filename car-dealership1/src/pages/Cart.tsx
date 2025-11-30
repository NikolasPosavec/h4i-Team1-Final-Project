import Navbar from "../components/navbar";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import type { Car } from "../types";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../firebase/config";

function Cart() {
  const location = useLocation();
  const [cartItems, setCartItems] = useState<Car[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [shippingInfo, setShippingInfo] = useState({
    firstName: "",
    lastName: "",
    address: "",
    zipCode: "",
    city: "",
    state: "",
  });
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: "",
    expiration: "",
    cvc: "",
  });
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  //load cart from localStorage whenever the route is visited
  useEffect(() => {
    setIsLoaded(false);
    try {
      const savedCart = localStorage.getItem("shellfax_cart");
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        setCartItems(parsedCart);
      } else {
        setCartItems([]);
      }
    } catch (error) {
      console.error("Error loading cart:", error);
      setCartItems([]);
    } finally {
      setIsLoaded(true); 
    }
  }, [location.pathname]);

  //save cart to localStorage whenever it changes (but only after initial load)
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("shellfax_cart", JSON.stringify(cartItems));
    }
  }, [cartItems, isLoaded]);

  const removeFromCart = (carId: string) => {
    setCartItems(cartItems.filter((item) => item.id !== carId));
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + item.price, 0);
  };

  const calculateShipping = () => {
    return cartItems.length > 0 ? 499 : 0;
  };

  const calculateTax = () => {
    return Math.round(calculateSubtotal() * 0.07);
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateShipping() + calculateTax();
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    setShowCheckout(true);
  };

  const handleConfirmPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptedTerms) {
      alert("Please accept the terms and conditions");
      return;
    }

    try {
      //get current user
      const user = auth.currentUser;
      if (!user) {
        alert("You must be logged in to place an order");
        return;
      }

      //prepare order data
      const orderData = {
        userId: user.uid,
        userEmail: user.email,
        items: cartItems.map(car => ({
          carId: car.id,
          make: car.make,
          model: car.model,
          year: car.year,
          trim: car.trim,
          color: car.color,
          price: car.price,
          mileage: car.mileage,
          image_url: car.image_url
        })),
        shippingInfo: {
          firstName: shippingInfo.firstName,
          lastName: shippingInfo.lastName,
          address: shippingInfo.address,
          city: shippingInfo.city,
          state: shippingInfo.state,
          zipCode: shippingInfo.zipCode,
        },
        paymentInfo: {
          method: "Credit Card (simulated)",
          lastFourDigits: paymentInfo.cardNumber.slice(-4),
        },
        pricing: {
          subtotal: calculateSubtotal(),
          shipping: calculateShipping(),
          tax: calculateTax(),
          total: calculateTotal(),
        },
        orderDate: serverTimestamp(),
        status: "completed",
      };

      //save order to firebase
      const ordersRef = collection(db, "orders");
      const docRef = await addDoc(ordersRef, orderData);
      
      console.log("Order saved with ID:", docRef.id);

      //clear cart and show success
      setCartItems([]);
      setShowCheckout(false);
      setShowThankYou(true);
      setShippingInfo({
        firstName: "",
        lastName: "",
        address: "",
        zipCode: "",
        city: "",
        state: "",
      });
      setPaymentInfo({
        cardNumber: "",
        expiration: "",
        cvc: "",
      });
      setAcceptedTerms(false);

    } catch (error) {
      console.error("Error saving order:", error);
      alert("There was an error processing your order. Please try again.");
    }
  };

  const handleBackToShopping = () => {
    setShowThankYou(false);
  };

  if (showThankYou) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-yellow-400 rounded-2xl border-4 border-gray-800 p-12">
              <h1 className="text-5xl font-bold mb-6">THANK YOU!</h1>
              <p className="text-2xl mb-8">
                Your order has been successfully placed.
              </p>
              <p className="text-lg mb-8">
                We'll contact you shortly with delivery details.
              </p>
              <Link
                to="/"
                onClick={handleBackToShopping}
                className="inline-block bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-full transition-colors"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showCheckout) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-center mb-8">CHECKOUT</h1>
          <form onSubmit={handleConfirmPayment}>
            <div className="grid lg:grid-cols-2 gap-6 max-w-7xl mx-auto">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Shipping Information */}
                <div className="bg-gray-200 rounded-2xl border-4 border-gray-800 p-6">
                  <h2 className="text-2xl font-bold mb-6">
                    Shipping Information
                  </h2>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          First Name
                        </label>
                        <input
                          type="text"
                          value={shippingInfo.firstName}
                          onChange={(e) =>
                            setShippingInfo({
                              ...shippingInfo,
                              firstName: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Last Name
                        </label>
                        <input
                          type="text"
                          value={shippingInfo.lastName}
                          onChange={(e) =>
                            setShippingInfo({
                              ...shippingInfo,
                              lastName: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Address
                      </label>
                      <input
                        type="text"
                        value={shippingInfo.address}
                        onChange={(e) =>
                          setShippingInfo({
                            ...shippingInfo,
                            address: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Zip Code
                        </label>
                        <input
                          type="text"
                          value={shippingInfo.zipCode}
                          onChange={(e) =>
                            setShippingInfo({
                              ...shippingInfo,
                              zipCode: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          City
                        </label>
                        <input
                          type="text"
                          value={shippingInfo.city}
                          onChange={(e) =>
                            setShippingInfo({
                              ...shippingInfo,
                              city: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          State
                        </label>
                        <select
                          value={shippingInfo.state}
                          onChange={(e) =>
                            setShippingInfo({
                              ...shippingInfo,
                              state: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg"
                          required
                        >
                          <option value="">Select</option>
                          <option value="MD">MD</option>
                          <option value="VA">VA</option>
                          <option value="DC">DC</option>
                          <option value="PA">PA</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Information */}
                <div className="bg-gray-200 rounded-2xl border-4 border-gray-800 p-6">
                  <h2 className="text-2xl font-bold mb-6">
                    Payment Information
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Card Number
                      </label>
                      <input
                        type="text"
                        placeholder="1234 1234 1234 1234"
                        value={paymentInfo.cardNumber}
                        onChange={(e) =>
                          setPaymentInfo({
                            ...paymentInfo,
                            cardNumber: e.target.value,
                          })
                        }
                        maxLength={19}
                        className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Expiration
                        </label>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          value={paymentInfo.expiration}
                          onChange={(e) =>
                            setPaymentInfo({
                              ...paymentInfo,
                              expiration: e.target.value,
                            })
                          }
                          maxLength={5}
                          className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          CVC
                        </label>
                        <input
                          type="text"
                          placeholder="CVC"
                          value={paymentInfo.cvc}
                          onChange={(e) =>
                            setPaymentInfo({
                              ...paymentInfo,
                              cvc: e.target.value,
                            })
                          }
                          maxLength={3}
                          className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Order Summary */}
              <div className="space-y-6">
                {cartItems.map((car) => (
                  <div
                    key={car.id}
                    className="bg-gray-200 rounded-2xl border-4 border-gray-800 overflow-hidden"
                  >
                    <div className="p-6">
                      <img
                        src={car.image_url}
                        alt={`${car.year} ${car.make} ${car.model}`}
                        className="w-full h-64 object-cover rounded-lg mb-4"
                      />
                      <h3 className="text-3xl font-bold text-center mb-4">
                        {car.year} {car.make} {car.model}
                      </h3>
                    </div>
                  </div>
                ))}

                <div className="bg-gray-200 rounded-2xl border-4 border-gray-800 p-6">
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-lg">
                      <span>Shipping</span>
                      <span>${calculateShipping().toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-lg">
                      <span>Discount</span>
                      <span>$0</span>
                    </div>
                    <div className="flex justify-between text-lg">
                      <span>Subtotal</span>
                      <span>${calculateSubtotal().toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-lg">
                      <span>Tax</span>
                      <span>${calculateTax().toLocaleString()}</span>
                    </div>
                    <div className="border-t-2 border-gray-400 pt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-2xl font-bold">Total</span>
                        <span className="text-2xl font-bold">
                          ${calculateTotal().toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="mb-6">
                    <label className="flex items-start gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={acceptedTerms}
                        onChange={(e) => setAcceptedTerms(e.target.checked)}
                        className="mt-1"
                        required
                      />
                      <span className="text-sm">
                        I accept the terms{" "}
                        <a
                          href="#"
                          className="text-red-600 underline hover:text-red-700"
                        >
                          Read our T&C's
                        </a>
                      </span>
                    </label>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                  >
                    CONFIRM PAYMENT
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">YOUR CART</h1>

        {cartItems.length === 0 ? (
          <div className="max-w-2xl mx-auto">
            <div className="bg-gray-200 rounded-2xl border-4 border-gray-800 p-12 text-center">
              <h2 className="text-3xl font-bold mb-4">No Items in Cart</h2>
              <p className="text-xl mb-6">
                Your cart is empty. Start shopping to add vehicles!
              </p>
              <Link
                to="/"
                className="inline-block bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-full transition-colors"
              >
                Browse Inventory
              </Link>
            </div>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
              {cartItems.map((car) => (
                <div
                  key={car.id}
                  className="bg-gray-200 rounded-2xl border-4 border-gray-800 overflow-hidden"
                >
                  <img
                    src={car.image_url}
                    alt={`${car.year} ${car.make} ${car.model}`}
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-2xl font-bold mb-2">
                      {car.year} {car.make} {car.model}
                    </h3>
                    <p className="text-gray-600 mb-2">{car.trim}</p>
                    <p className="text-xl font-bold text-red-600 mb-4">
                      ${car.price.toLocaleString()}
                    </p>
                    <div className="flex gap-2">
                      <Link
                        to={`/car/${car.id}`}
                        className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-2 px-4 rounded-lg text-center transition-colors"
                      >
                        View Details
                      </Link>
                      <button
                        onClick={() => removeFromCart(car.id)}
                        className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Cart Summary */}
            <div className="max-w-md mx-auto">
              <div className="bg-yellow-400 rounded-2xl border-4 border-gray-800 p-6">
                <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="font-bold">
                      ${calculateSubtotal().toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping:</span>
                    <span className="font-bold">
                      ${calculateShipping().toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (7%):</span>
                    <span className="font-bold">
                      ${calculateTax().toLocaleString()}
                    </span>
                  </div>
                  <div className="border-t-2 border-gray-800 pt-2 mt-2">
                    <div className="flex justify-between text-xl">
                      <span className="font-bold">Total:</span>
                      <span className="font-bold">
                        ${calculateTotal().toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleCheckout}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-full transition-colors"
                >
                  Proceed to Checkout
                </button>
                {cartItems.length >= 2 && (
                  <p className="text-sm text-center mt-4 text-gray-700">
                    Maximum 2 vehicles per order
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;