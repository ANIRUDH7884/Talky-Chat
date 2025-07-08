import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "./assets/Styles/main.scss";
import { ToastProvider } from "./Contexts/Toaster/Toaster";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter> 
     <ToastProvider>
        <App />
     </ToastProvider>
    </BrowserRouter>
  </React.StrictMode>
);
