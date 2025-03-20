import {
  useWriteContract,
  useWaitForTransactionReceipt,
  useReadContract,
} from "wagmi";
import { useState, useEffect } from "react";
import { parseEther, formatEther } from "viem";
import rawFactoryABI from "../abi/CarDealer.json";
import { uploadToPinata } from "../utils/Pinata";

const carDealerAddress = "0x39B74Fa2E69C0256f8b34dBfa9cfE20e0438388c";
const carDealerABI = rawFactoryABI.abi;

export function useRegisterCar() {
  const [model, setModel] = useState("");
  const [color, setColor] = useState("");
  const [price, setPrice] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const { data: hash, writeContract } = useWriteContract();
  const { isLoading, isSuccess } = useWaitForTransactionReceipt({ hash });

  const registerCar = async () => {
    if (!model || !color || !price || !imageFile) {
      alert("All fields are required!");
      return;
    }

    setUploading(true);

    try {
      const imageURI = await uploadToPinata(imageFile);
      console.log("Image uploaded:", imageURI);

      const priceInWei = parseEther(price);

      await writeContract({
        address: carDealerAddress,
        abi: carDealerABI,
        functionName: "registerCar",
        args: [model, color, priceInWei, imageURI],
      });

      console.log("Car registered successfully!");
    } catch (error) {
      console.error("Error registering car", error);
    } finally {
      setUploading(false);
    }
  };

  return {
    model,
    setModel,
    color,
    setColor,
    price,
    setPrice,
    imageFile,
    setImageFile,
    registerCar,
    isLoading,
    isSuccess,
    uploading,
  };
}

export function useBuyCar() {
  const [carId, setCarId] = useState<string>("");
  const [carPrice, setCarPrice] = useState<bigint>(BigInt(0));

  const { data: hash, writeContract } = useWriteContract();
  const { isLoading, isSuccess } = useWaitForTransactionReceipt({ hash });

  const buyCar = async () => {
    if (!carId || !carPrice) {
      alert("Car ID is required!");
      return;
    }

    try {
      await writeContract({
        address: carDealerAddress,
        abi: carDealerABI,
        functionName: "buyCar",
        args: [BigInt(carId)],
        value: carPrice,
      });

      console.log("Car purchased successfully!");
    } catch (error) {
      console.error("Error buying car", error);
    }
  };

  return {
    carId,
    setCarId,
    carPrice,
    setCarPrice,
    buyCar,
    isLoading,
    isSuccess,
  };
}

export function useGetCarsForSale() {
  const [cars, setCars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const { data: carsData, refetch } = useReadContract({
    address: carDealerAddress,
    abi: carDealerABI,
    functionName: "getCarsForSale",
  });

  useEffect(() => {
    if (carsData) {
      const formattedCars = formatCarData(carsData as any[]);
      setCars(formattedCars);
      setLoading(false);
    }
  }, [carsData]);

  const refreshCars = async () => {
    setLoading(true);
    await refetch();
  };

  return { cars, loading, refreshCars };
}

export function useGetMyCars() {
  const [cars, setCars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const { data: carsData, refetch } = useReadContract({
    address: carDealerAddress,
    abi: carDealerABI,
    functionName: "getMyCars",
  });

  useEffect(() => {
    if (carsData) {
      const formattedCars = formatCarData(carsData as any[]);
      setCars(formattedCars);
      setLoading(false);
    }
  }, [carsData]);

  const refreshMyCars = async () => {
    setLoading(true);
    await refetch();
  };

  return { cars, loading, refreshMyCars };
}

export function useGetCarDetails() {
  const [car, setCar] = useState<any | null>(null);
  const [carHistory, setCarHistory] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCarDetails = async (carId: string) => {
    if (!carId) {
      alert("Car ID is required!");
      return;
    }

    setLoading(true);

    try {
      // Using direct contract calls instead of hooks for one-time fetching
      const carResponse = await fetch('/api/getCarData', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          contractAddress: carDealerAddress,
          functionName: 'getCar',
          args: [BigInt(carId).toString()]
        }),
      });
      
      const historyResponse = await fetch('/api/getCarData', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          contractAddress: carDealerAddress,
          functionName: 'getCarHistory',
          args: [BigInt(carId).toString()]
        }),
      });

      if (carResponse.ok) {
        const carData = await carResponse.json();
        const formattedCar = formatSingleCarData(carData.result);
        setCar(formattedCar);
      }

      if (historyResponse.ok) {
        const historyData = await historyResponse.json();
        setCarHistory(historyData.result);
      }
    } catch (error) {
      console.error("Error fetching car details", error);
    } finally {
      setLoading(false);
    }
  };

  return { car, carHistory, loading, fetchCarDetails };
}

// Alternative implementation using React Query pattern
export function useGetCarDetail() {
  const [carId, setCarId] = useState<string>("");
  
  const { data: carData, isLoading: isLoadingCar } = useReadContract({
    address: carDealerAddress,
    abi: carDealerABI,
    functionName: "getCar",
    args: carId ? [BigInt(carId)] : undefined,
    query: {
      enabled: Boolean(carId),
    }
  });
  
  const { data: historyData, isLoading: isLoadingHistory } = useReadContract({
    address: carDealerAddress,
    abi: carDealerABI,
    functionName: "getCarHistory",
    args: carId ? [BigInt(carId)] : undefined,
    query: {
      enabled: Boolean(carId),
    }
  });
  
  const car = carData ? formatSingleCarData(carData as any) : null;
  const carHistory = historyData as string[] || [];
  const loading = isLoadingCar || isLoadingHistory;
  
  return { car, carHistory, loading, setCarId };
}

// Helper function to format car data
function formatCarData(cars: any[]) {
  return cars.map(car => formatSingleCarData(car));
}

function formatSingleCarData(car: any) {
  return {
    id: Number(car.id),
    model: car.model,
    color: car.color,
    price: formatEther(car.price),
    priceWei: car.price,
    owner: car.owner,
    seller: car.seller,
    forSale: car.forSale,
    previousOwners: car.previousOwners,
    imageURI: car.imageURI,
  };
}