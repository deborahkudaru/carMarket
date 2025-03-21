import Home from "./pages/Home";
import {Routes, Route} from "react-router-dom";
// import ListedCars from "./pages/ListedCars";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import RegisterCarForm from "./pages/RegisterCarForm";
import MyCars from "./pages/MyCars";
import CarDetails from "./pages/CarDetails";
import CarListings from "./pages/ListCarForSale";
// import ListCarForSale from "./pages/ListCarForSale";


function App() {
  return (
    <div className="">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/listed-cars" element={<CarListings />} />
        <Route path="/form" element={<RegisterCarForm />} />
        <Route path="/my-cars" element={<MyCars />} />
       <Route path="/car/:carId" element={<CarDetails />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
