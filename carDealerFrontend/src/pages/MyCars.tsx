import { useEffect } from "react";
import { useGetMyCars } from "../hooks/useCarDealer";
import { Link } from "react-router-dom";

const MyCars = () => {
  const { cars, loading, refreshMyCars } = useGetMyCars();

  useEffect(() => {
    refreshMyCars();
  }, []);

  if (loading) {
    return <div className="text-white text-center mt-10 text-lg">Loading your cars...</div>;
  }

  return (
    <div className="bg-[#111827] min-h-screen p-6 text-white">
      <h1 className="text-3xl font-bold text-center mb-6">My Cars</h1>

      {cars.length === 0 ? (
        <p className="text-center text-gray-400">You don't own any cars yet. Purchase a car to see it here.</p>
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
              <p className="text-gray-400">Color: <span className="text-white">{car.color}</span></p>
              <p className="text-gray-400">Purchased for: <span className="text-green-400">{car.price} ETH</span></p>
              <Link to={`/car/${car.id}`}>
                <button className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg transition duration-300">
                  View Details
                </button>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyCars;
