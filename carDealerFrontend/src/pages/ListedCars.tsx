import React from 'react';
import { motion } from 'framer-motion';
import car1 from "../assets/car1.png";
import car2 from "../assets/car3.png";
import car3 from "../assets/car6.png"
import car4 from "../assets/car5.png"

// Define car interface
interface Car {
  id: number;
  model: string;
  price: number;
  color: string;
  image: string;
}

// Sample car data
const cars: Car[] = [
  {
    id: 1,
    model: "Tesla Model S",
    price: 1,
    color: "Midnight Silver",
    image: car1
  },
  {
    id: 2,
    model: "BMW i8",
    price: 2.1,
    color: "Pearl White",
    image: car2
  },
  {
    id: 3,
    model: "Audi e-tron GT",
    price: 2.01,
    color: "Daytona Gray",
    image: car3
  },
  {
    id: 4,
    model: "Porsche Taycan",
    price: 3.2,
    color: "Frozen Blue",
    image: car4
  }
];

const ListedCars: React.FC = () => {
  // Card animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    },
    hover: { 
      y: -10,
      scale: 1.03,
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 10px 10px -5px rgba(0, 0, 0, 0.2)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 bg-gray-900">
      <motion.h1 
        className="text-2xl font-bold mb-7 text-gray-400 tracking-tight"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
         Listed Cars
      </motion.h1>
      
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {cars.map((car) => (
          <motion.div
            key={car.id}
            className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700"
            variants={cardVariants}
            whileHover="hover"
          >
            <div className="relative">
              <div className="h-52 w-full overflow-hidden bg-gray-900">
                <motion.img 
                  src={car.image} 
                  alt={car.model} 
                  className="w-full h-full object-cover object-center opacity-90"
                  whileHover={{ scale: 1.05, opacity: 1 }}
                  transition={{ type: "tween", duration: 0.5 }}
                />
              </div>
            </div>
            
            <div className="p-5">
              <motion.h2 
                className="text-xl font-bold text-white mb-2 truncate"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {car.model}
              </motion.h2>
              
              <div className="flex justify-between items-center mb-4">
                <motion.span 
                  className="text-gray-400 text-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <span className="font-medium">{car.color}</span>
                </motion.span>
                
                <motion.div 
                  className="flex items-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <div 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ 
                      backgroundColor: car.color.toLowerCase().includes('silver') ? '#C0C0C0' : 
                                      car.color.toLowerCase().includes('white') ? '#FFFFFF' : 
                                      car.color.toLowerCase().includes('gray') || car.color.toLowerCase().includes('grey') ? '#808080' : 
                                      car.color.toLowerCase().includes('blue') ? '#60A5FA' : '#DDDDDD'
                    }}
                  />
                  <span className="text-gray-400 text-xs">
                    Premium Finish
                  </span>
                </motion.div>
              </div>
              
              <motion.div 
                className="mt-4 pt-4 border-t border-gray-700 flex justify-between items-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <div>
                  <p className="text-gray-400 text-xs mb-1">Starting at</p>
                  <span className="text-2xl font-bold text-indigo-400">
                  {car.price} ETH
                  </span>
                </div>
                
                <motion.button 
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium group flex items-center"
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ 
                    backgroundColor: "#4F46E5", 
                    boxShadow: "0 0 15px 2px rgba(79, 70, 229, 0.3)" 
                  }}
                  transition={{ duration: 0.2 }}
                >
                  Details
                  <motion.svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-4 w-4 ml-1 group-hover:translate-x-1"
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                    initial={{ x: 0 }}
                    animate={{ x: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </motion.svg>
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default ListedCars;