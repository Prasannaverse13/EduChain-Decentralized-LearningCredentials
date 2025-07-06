import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Ensure light mode is always active
document.documentElement.classList.remove('dark');
localStorage.removeItem('theme');

createRoot(document.getElementById("root")!).render(<App />);
