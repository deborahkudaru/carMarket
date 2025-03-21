import { useEffect, useState } from "react";
import { useGetCarsForSale } from "../hooks/useCarDealer";
import BuyCar from "../components/BuyCar";

const CarListings = () => {
  const { cars, loading, refreshCars } = useGetCarsForSale();
  const [selectedCar, setSelectedCar] = useState<{ id: string; color: string; model: string; price: string; seller: string; } | null>(null);

  useEffect(() => {
    refreshCars();
  }, []);

  const handleBuy = (car: any) => {
    setSelectedCar(car);
  };

  const handleCloseModal = () => {
    setSelectedCar(null);
    refreshCars();
  };

  if (loading) {
    return <div className="text-white text-center mt-10 text-lg">Loading cars for sale...</div>;
  }

  return (
    <div className="bg-[#111827] min-h-screen p-6 text-white">
      <h1 className="text-3xl font-bold text-center mb-6">Cars For Sale</h1>

      {cars.length === 0 ? (
        <p className="text-center text-gray-400">No cars available for sale at the moment.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {cars.map((car) => (
            <div key={car.id} className="bg-gray-900 p-4 rounded-lg shadow-lg">
              {car.imageURI && (
                <img
                  src={car.imageURI.startsWith("ipfs://") 
                    ? `https://gateway.pinata.cloud/ipfs/${car.imageURI.substring(7)}` 
                    : car.imageURI}
                  alt={`${car.color} ${car.model}`}
                  className="w-full h-40 object-cover rounded-md"
                />
              )}
              <h3 className="text-xl font-semibold mt-3">{car.model}</h3>
              <p className="text-gray-400">
                Color: <span className="text-white">{car.color}</span>
              </p>
              <p className="text-gray-400">
                Price: <span className="text-green-400">{car.price} ETH</span>
              </p>
              <p className="text-gray-400">
                Seller: <span className="text-gray-300">{car.seller.substring(0, 6)}...{car.seller.substring(38)}</span>
              </p>
              <button
                onClick={() => handleBuy(car)}
                className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg transition duration-300"
              >
                Buy Now
              </button>
            </div>
          ))}
        </div>
      )}

      {selectedCar && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center">
          <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-96 text-center">
            <h2 className="text-2xl font-semibold mb-4">Confirm Purchase</h2>
            <p className="text-gray-300">You are about to purchase:</p>
            <p className="text-lg font-semibold mt-2">{selectedCar.color} {selectedCar.model}</p>
            <p className="text-green-400 text-lg">Price: {selectedCar.price} ETH</p>

            <div className="mt-4">
              <BuyCar 
                initialCarId={selectedCar.id.toString()} 
              />
            </div>

            <button
              onClick={handleCloseModal}
              className="mt-4 w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded-lg transition duration-300"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CarListings;
