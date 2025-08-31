import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Hide the initial loader once React app is ready
setTimeout(() => {
  const loader = document.getElementById("initial-loader");
  if (loader) {
    loader.style.opacity = "0";
    loader.style.transition = "opacity 0.2s ease-out";
    setTimeout(() => {
      loader.style.display = "none";
    }, 200);
  }
}, 500);

createRoot(document.getElementById("root")!).render(<App />);
