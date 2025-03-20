import { ConnectButton } from "@rainbow-me/rainbowkit";
import logo from "../assets/logo.png";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div>
      <div className="shadow-lg bg-[#1E293B]">
        <nav className="flex justify-between px-10 py-3">
          <Link to="/">
            <img src={logo} alt="" height={70} width={70} />
          </Link>
          <div className="flex gap-5 ">
            <Link
              to="/form"
              className="text-white self-center border-[#4f46e5] border px-4 py-1.5 rounded-lg hover:bg-[#4f46e5] "
            >
              Register car
            </Link>
            <div className="self-center">
              <ConnectButton />
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Navbar;
