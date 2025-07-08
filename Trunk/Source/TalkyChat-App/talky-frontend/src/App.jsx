import { Routes, Route } from "react-router-dom";
import Login from "./Pages/Login/Login";
import Register from "./Pages/Register/Register";
import Home from "./Pages/Home/Home";
import Dashboard from "./Pages/Dashboard/Dashboard.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />

    </Routes>
  );
}

export default App;
