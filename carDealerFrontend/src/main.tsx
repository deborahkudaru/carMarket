import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import CustomRainbowKitProvider from "./providers/RainbowKit";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <CustomRainbowKitProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </CustomRainbowKitProvider>
  </StrictMode>
);
