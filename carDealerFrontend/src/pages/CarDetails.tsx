import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useGetCarDetails } from "../hooks/useCarDealer";

const CarDetails: React.FC = () => {
  const { carId } = useParams<{ carId: string }>();
  const { car, carHistory, loading, fetchCarDetails } = useGetCarDetails();

  useEffect(() => {
    if (carId) {
      fetchCarDetails(carId);
    }
  }, [carId]);

  if (loading) {
    return <div>Loading car details...</div>;
  }

  if (!car) {
    return <div>Car not found or failed to load.</div>;
  }

  return (
    <div className="car-details">
      <h1>Car Details</h1>
      
      <div className="car-info">
        {car.imageURI && (
          <img 
            src={car.imageURI.startsWith('ipfs://') 
              ? `https://gateway.pinata.cloud/ipfs/${car.imageURI.substring(7)}` 
              : car.imageURI} 
            alt={`${car.color} ${car.model}`} 
            className="car-image"
          />
        )}
        
        <div className="car-specs">
          <h2>{car.model}</h2>
          <p><strong>ID:</strong> {car.id}</p>
          <p><strong>Color:</strong> {car.color}</p>
          <p><strong>Price:</strong> {car.price} ETH</p>
          <p><strong>Current Owner:</strong> {car.owner}</p>
          <p><strong>For Sale:</strong> {car.forSale ? "Yes" : "No"}</p>
          
          {car.forSale && (
            <p><strong>Seller:</strong> {car.seller}</p>
          )}
        </div>
      </div>
      
      <div className="car-history">
        <h3>Ownership History</h3>
        {carHistory.length === 0 ? (
          <p>No previous owners.</p>
        ) : (
          <ul>
            {carHistory.map((address, index) => (
              <li key={index}>
                {address}
                {index === 0 && " (Original Owner)"}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default CarDetails;