import React from "react";
import { useBuyCar } from "../hooks/useCarDealer"

const BuyCar: React.FC<{ initialCarId?: string; initialPrice?: bigint }> = ({
  initialCarId = "",
  initialPrice = BigInt(0),
}) => {
  const { carId, setCarId, carPrice, setCarPrice, buyCar, isLoading, isSuccess } = useBuyCar();

  React.useEffect(() => {
    if (initialCarId) {
      setCarId(initialCarId);
    }
    if (initialPrice) {
      setCarPrice(initialPrice);
    }
  }, [initialCarId, initialPrice, setCarId, setCarPrice]);

  return (
    <div className="buy-car-container">
      <h2>Buy Car</h2>
      
      {!initialCarId && (
        <div className="form-group">
          <label htmlFor="carId">Car ID:</label>
          <input
            type="text"
            id="carId"
            value={carId}
            onChange={(e) => setCarId(e.target.value)}
            disabled={isLoading}
          />
        </div>
      )}
      
      <button
        onClick={buyCar}
        disabled={isLoading || !carId || !carPrice}
      >
        {isLoading ? "Processing..." : `Buy Car for ${carPrice ? (Number(carPrice) / 10**18).toFixed(4) : 0} ETH`}
      </button>
      
      {isSuccess && <div className="success-message">Car purchased successfully!</div>}
    </div>
  );
};

export default BuyCar;