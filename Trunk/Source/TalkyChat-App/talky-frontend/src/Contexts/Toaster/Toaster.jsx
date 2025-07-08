import { createContext, useContext } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const showSuccess = (message) => {
    toast.success(message, {
      position: "bottom-right",
      autoClose: 3000,
      theme: "light", // or "dark" based on your theme
    });
  };

  const showError = (message) => {
    toast.error(message, {
      position: "bottom-right",
      autoClose: 3000,
      theme: "light", // or "dark"
    });
  };

  const showInfo = (message) => {
    toast.info(message, {
      position: "bottom-right",
      autoClose: 3000,
      theme: "light",
    });
  };

  return (
    <ToastContext.Provider value={{ showSuccess, showError, showInfo }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
