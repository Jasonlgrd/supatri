import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import "./index.css";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthProvider>
      <App />
    </AuthProvider>
  </BrowserRouter>
);
