import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Hide the instant layout once React renders
const hideInstantLayout = () => {
  const instantLayout = document.getElementById("instant-layout");
  if (instantLayout) {
    instantLayout.style.display = "none";
  }
};

createRoot(document.getElementById("root")!).render(<App />);

// Hide instant layout after React renders
setTimeout(hideInstantLayout, 50);
