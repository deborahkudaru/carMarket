import { useState, useEffect } from "react";
import { FC } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NextIcon, PrevIcon } from "../assets/icons/icons";
import slides from "../constants/carData";
import { Link } from "react-router-dom";

const Hero: FC = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [direction, setDirection] = useState(1);

  const handleNext = () => {
    setDirection(1);
    setActiveSlide((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      handleNext();
    }, 3000);

    return () => clearInterval(interval);
  }, [activeSlide, isPaused]);

  const pauseAutoSlide = () => {
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 20000);
  };

  return (
    <div className="text-white flex px-5 justify-center items-center w-full mt-7 mb-20">
      <div className="2xl:max-w-[2560px] w-full">
        <div className="lg:flex lg:items-center lg:gap-2">
          <button
            onClick={() => {
              handlePrev();
              pauseAutoSlide();
            }}
            aria-label="Previous slide"
            className="p-[14px] rounded-lg bg-white/10 hover:bg-white/20 transition-colors lg:block hidden"
          >
            <PrevIcon />
          </button>
          <div
            className="bg-[url('/noise.p] bg-cover bg-center bg-no-repeat xl:pt-10 xl:px-10 lg:pt-7 lg:px-7 md:px-3 md:py-3 px-4 py-10 rounded-[18px]"
            role="region"
            aria-label="Image carousel"
            tabIndex={0}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div className="lg:grid grid-cols-1 xl:grid-cols-2 lg:grid-cols-2 md:grid-cols-2 gap-10 w-full flex flex-col-reverse">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={slides[activeSlide].id}
                  initial={{ opacity: 0, x: direction * 100 }}
                  animate={{ opacity: 1, x: 0, transition: { duration: 0.5 } }}
                  exit={{ opacity: 0, x: -direction * 100 }}
                  className="self-center text-center lg:text-left max-w-xl lg:min-h-[72px] min-h-[213px] flex flex-col xl:gap-4 lg:gap-2"
                >
                  <p className="font-medium text-sm leading-6 text-white/60">
                    COLLECTIONS
                  </p>
                  <h1 className="font-bold 2xl:text-[60px] xl:text-[45px] lg:text-[35px] md:text-[30px] text-[28px] leading-[63.9px]">
                    {slides[activeSlide].title}
                  </h1>
                  <p className="font-semibold 2xl:text-lg xl:text-base">
                    {slides[activeSlide].description}
                  </p>
                  <div>
                    <motion.button
                      className="bg-[#FAFAFA] lg:py-3 lg:px-5 px-[14px] py-2 rounded-lg text-black"
                      whileHover={{ scale: 1.05 }}
                    >
                      <Link to="/listed-cars"> Buy now!</Link>
                    </motion.button>
                  </div>
                </motion.div>
              </AnimatePresence>
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={slides[activeSlide].image}
                  initial={{ opacity: 0, x: direction * 100 }}
                  animate={{ opacity: 1, x: 0, transition: { duration: 0.5 } }}
                  exit={{ opacity: 0, x: -direction * 100 }}
                  className="flex justify-center"
                >
                  <img
                    src={slides[activeSlide].image}
                    alt={slides[activeSlide].title}
                    width={500}
                    height={30}
                    className="max-w-full h-auto 2xl:w-[1000px] 2xl:h-[600px]"
                  />
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="flex justify-center space-x-2">
              {slides.map((_, index) => (
                <motion.div
                  key={index}
                  className={`h-1 rounded transition-all mt-5 ${
                    index === activeSlide
                      ? "bg-white lg:w-[200px] md:w-[100px] w-[50px]"
                      : "bg-white/20 lg:w-14 md:w-10 w-5"
                  }`}
                  role="button"
                  tabIndex={0}
                  aria-label={`Go to slide ${index + 1}`}
                  onClick={() => {
                    setDirection(index > activeSlide ? 1 : -1);
                    setActiveSlide(index);
                    pauseAutoSlide();
                  }}
                />
              ))}
            </div>
          </div>
          <button
            onClick={() => {
              handleNext();
              pauseAutoSlide();
            }}
            aria-label="Next slide"
            className="p-[14px] rounded-lg bg-white/10 hover:bg-white/20 transition-colors lg:block hidden"
          >
            <NextIcon />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
