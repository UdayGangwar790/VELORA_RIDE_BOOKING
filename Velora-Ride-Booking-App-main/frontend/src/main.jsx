import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import "./index.css";
import App from "./App.jsx";

import UserContext from "./context/UserContext";
import CaptainContext from "./context/CaptainContext";
import SocketProvider from "./context/SocketContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <CaptainContext>
        <UserContext>
          <SocketProvider>
            <App />
          </SocketProvider>
        </UserContext>
      </CaptainContext>
    </BrowserRouter>
  </StrictMode>
);

// Register Service Worker
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/velora-sw.js")
      .then((reg) => console.log("Service Worker registered", reg))
      .catch((err) => console.error("Service Worker failed", err));
  });
}