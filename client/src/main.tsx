import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Hide the initial loader once React app is ready
setTimeout(() => {
  const loader = document.getElementById("initial-loader");
  if (loader) {
    loader.style.display = "none";
  }
}, 100);

createRoot(document.getElementById("root")!).render(<App />);
