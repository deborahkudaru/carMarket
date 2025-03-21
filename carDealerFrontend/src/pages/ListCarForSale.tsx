import React, { useEffect } from "react";
import { useGetCarsForSale } from "../hooks/useCarDealer";
import BuyCar from "../components/BuyCar";

const CarListings: React.FC = () => {
  const { cars, loading, refreshCars } = useGetCarsForSale();
  const [selectedCar, setSelectedCar] = React.useState<any | null>(null);

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
    return <div>Loading cars for sale...</div>;
  }

  return (
    <div className="car-listings">
      <h1>Cars For Sale</h1>
      <button onClick={refreshCars}>Refresh Listings</button>
      
      {cars.length === 0 ? (
        <p>No cars available for sale at the moment.</p>
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
              <p>Price: {car.price} ETH</p>
              <p>Seller: {car.seller.substring(0, 6)}...{car.seller.substring(38)}</p>
              <button onClick={() => handleBuy(car)}>Buy Now</button>
            </div>
          ))}
        </div>
      )}

      {selectedCar && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Confirm Purchase</h2>
            <p>You are about to purchase:</p>
            <p>{selectedCar.color} {selectedCar.model}</p>
            <p>Price: {selectedCar.price} ETH</p>
            
            <BuyCar 
              initialCarId={selectedCar.id.toString()} 
              initialPrice={selectedCar.priceWei} 
            />
            
            <button onClick={handleCloseModal}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CarListings;