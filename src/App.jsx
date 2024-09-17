import { useState } from "react";
import Navbar from "./components/RNavbar/RNavbar";
import RHomePage from "./pages/RHomePage/RHomePage";
import {Route, Routes, Link} from "react-router-dom";

import RDetailPage from "./pages/RDetailPage/RDetailPage";
import RAddRestaurant from "./pages/RAddRestaurant/RAddRestaurant";

import "./App.css";

function App() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);



  return (
    <div className="mainScreen">
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <RHomePage loading={loading} setLoading={setLoading} restaurants={restaurants} setRestaurants={setRestaurants} />
          }
        />
        <Route path="/restaurant/:id" element={<RDetailPage loading={loading} setLoading={setLoading}/>} /> 
        <Route path="/addnew" element={<RAddRestaurant loading={loading} setLoading={setLoading} setRestaurants={setRestaurants}/>} /> 
      </Routes>
    </div>
  );
}

export default App;
