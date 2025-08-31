import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Hide instant elements once React loads
setTimeout(() => {
  const footer = document.getElementById("instant-footer");
  const announcement = document.getElementById("instant-announcement");
  if (footer) footer.style.display = "none";
  if (announcement) announcement.style.display = "none";
}, 100);

createRoot(document.getElementById("root")!).render(<App />);
