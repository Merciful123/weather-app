import React from "react";
import ReactDOM from "react-dom/client";
// import App from './App.tsx'
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CitiesTable from "./components/Table";
import WeatherPage from "./pages/wheatherDetail";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CitiesTable />} />
        {/* <Route path="/add-todo" element={<CreateTodo />} /> */}
        <Route path="/weather/:lat/:lon" element={<WeatherPage />} />
      </Routes>
    </BrowserRouter>
    {/* <App /> */}
  </React.StrictMode>
);
