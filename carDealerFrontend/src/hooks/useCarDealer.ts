import {
   useWriteContract,
   useWaitForTransactionReceipt,
 } from "wagmi";
 import { useState } from "react";
 import { parseEther } from "viem";
 import rawFactoryABI from "../abi/CarDealer.json";
 import { uploadToPinata } from "../utils/Pinata";
 
 const carDealerAddress = "0x179BB60fa49Ed45437C51D352e4E36d1F078E6Af";
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
 