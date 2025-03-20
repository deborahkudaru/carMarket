import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { uploadToPinata } from "../utils/Pinata";
import { Toaster, toast } from "react-hot-toast";

interface FormData {
  model: string;
  price: string;
  color: string;
  image: File | null;
}

const RegisterCarForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    model: "",
    price: "",
    color: "",
    image: null,
  });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData({
        ...formData,
        image: file,
      });

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setFormData({
        ...formData,
        image: file,
      });

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form Data:", formData);
    setIsUploading(true);
    setUploadError(null);
    setUploadSuccess(null);

    if (!formData.image) {
      setUploadError("Please select an image to upload.");
      setIsUploading(false);
      return;
    }

    try {
      const imageUrl = await uploadToPinata(formData.image);
      setUploadSuccess("Image uploaded successfully!");
      console.log("success!")
      console.log("Image URL:", imageUrl);
      console.log("Form Data:", {
        ...formData,
        imageUrl,
      });
    } catch (error) {
      console.error("Upload Error:", error);
      setUploadError("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  if(uploadSuccess){
    toast.success("Registeration successful!");
  }

  if(uploadError){
    toast.error("Registeration failed")
  }

  return (
    <div className="container mx-auto px-4 py-12 bg-gray-900 min-h-screen">
      <Toaster position="top-right" />
      <motion.h1
        className="text-2xl font-bold mb-8 text-gray-300 tracking-tight"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Register Your Vehicle
      </motion.h1>

      <motion.form
        onSubmit={handleSubmit}
        className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 p-6 shadow-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image Upload Section - Left Side */}
          <div className="order-2 md:order-1">
            <div
              className="border-2 border-dashed border-gray-600 rounded-xl h-full min-h-64 flex flex-col items-center justify-center p-6 bg-gray-800 hover:bg-gray-750 transition duration-300 cursor-pointer"
              onClick={triggerFileInput}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
              />

              {previewUrl ? (
                <div className="w-full h-full">
                  <img
                    src={previewUrl}
                    alt="Car Preview"
                    className="w-full h-full object-contain rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPreviewUrl(null);
                      setFormData({ ...formData, image: null });
                    }}
                    className="mt-4 w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition duration-300 text-sm"
                  >
                    Remove Image
                  </button>
                </div>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-16 w-16 text-gray-500 mb-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <h3 className="text-lg font-medium text-indigo-400 mb-2">
                    Upload Vehicle Image
                  </h3>
                  <p className="text-gray-400 text-sm text-center mb-4">
                    Drag and drop your image here, or click to browse
                  </p>
                  <p className="text-gray-500 text-xs text-center">
                    Supported formats: JPG, PNG, WEBP
                    <br />
                    Max size: 5MB
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Form Inputs - Right Side */}
          <div className="space-y-6 order-1 md:order-2">
            <div>
              <label
                htmlFor="model"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Vehicle Model
              </label>
              <motion.input
                type="text"
                id="model"
                name="model"
                value={formData.model}
                onChange={handleInputChange}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition duration-200"
                placeholder="e.g. Tesla Model S"
                required
                whileFocus={{ scale: 1.01 }}
                transition={{ type: "spring", stiffness: 300, damping: 10 }}
              />
            </div>

            <div>
              <label
                htmlFor="price"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Price (ETH)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="text-gray-400">#</span>
                </div>
                <motion.input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg pl-8 pr-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition duration-200"
                  placeholder="e.g. 0.1"
                  min="0"
                  step="0.01"
                  required
                  whileFocus={{ scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 300, damping: 10 }}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="color"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Vehicle Color
              </label>
              <motion.input
                type="text"
                id="color"
                name="color"
                value={formData.color}
                onChange={handleInputChange}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition duration-200"
                placeholder="e.g. Midnight Silver"
                required
                whileFocus={{ scale: 1.01 }}
                transition={{ type: "spring", stiffness: 300, damping: 10 }}
              />
            </div>

            <div className="pt-6">
              <motion.button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-6 rounded-lg font-medium transition duration-300 flex justify-center items-center"
                whileHover={{
                  scale: 1.02,
                  boxShadow: "0 0 15px 2px rgba(79, 70, 229, 0.3)",
                }}
                whileTap={{ scale: 0.98 }}
              >

                {isUploading ? "Registering..." : " Register Vehicle"}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 ml-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.form>
    </div>
  );
};

export default RegisterCarForm;
