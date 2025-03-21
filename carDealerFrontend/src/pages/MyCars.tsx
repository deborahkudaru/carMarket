import React, { useEffect } from "react";
import { useGetMyCars } from "../hooks/useCarDealer";
import { Link } from "react-router-dom";

const MyCars: React.FC = () => {
  const { cars, loading, refreshMyCars } = useGetMyCars();

  useEffect(() => {
    // Refresh my cars when component mounts
    refreshMyCars();
  }, []);

  if (loading) {
    return <div>Loading your cars...</div>;
  }

  return (
    <div className="my-cars">
      <h1>My Cars</h1>
      <button onClick={refreshMyCars}>Refresh My Cars</button>
      
      {cars.length === 0 ? (
        <p>You don't own any cars yet. Purchase a car to see it here.</p>
      ) : (
        <div className="car-grid">
          {cars.map((car) => (
            <div key={car.id} className="car-card">
              {car.imageURI && (
                <img 
                  src={car.imageURI.startsWith('ipfs://') 
                    ? `https://gateway.pinata.cloud/ipfs/${car.imageURI.substring(7)}` 
                    : car.imageURI} 
                  alt={`${car.color} ${car.model}`} 
                />
              )}
              <h3>{car.model}</h3>
              <p>Color: {car.color}</p>
              <p>Purchased for: {car.price} ETH</p>
              <Link to={`/car/${car.id}`}>
                <button>View Details</button>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyCars;