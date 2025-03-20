import Home from "./pages/Home";
import {Routes, Route} from "react-router-dom";
import ListedCars from "./pages/ListedCars";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import RegisterCarForm from "./pages/RegisterCarForm";
// import ListCarForSale from "./pages/ListCarForSale";


function App() {
  return (
    <div className="">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/listed-cars" element={<ListedCars />} />
        <Route path="/form" element={<RegisterCarForm />} />
        {/* <Route path="/list-car" element={<ListCarForSale />} /> */}
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
