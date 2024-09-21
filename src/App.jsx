import { useState } from "react";
import Navbar from "./components/RNavbar/RNavbar";
import RHomePage from "./pages/RHomePage/RHomePage";
import RDetailPage from "./pages/RDetailPage/RDetailPage";
import RAddRestaurant from "./pages/RAddRestaurant/RAddRestaurant";
import RCharts from "./pages/RCharts/RCharts"
import { Route, Routes } from "react-router-dom";

import "./App.css";

function App() {
   const [restaurants, setRestaurants] = useState([]);
   const [loading, setLoading] = useState(true);

   return (
      <div className="bg-[#3d423c] m-0 p-0">
         <Navbar />
         <Routes>
            <Route
               path="/"
               element={
                  <RHomePage
                     loading={loading}
                     setLoading={setLoading}
                     restaurants={restaurants}
                     setRestaurants={setRestaurants}
                  />
               }
            />
            <Route
               path="/restaurant/:id"
               element={
                  <RDetailPage loading={loading} setLoading={setLoading} />
               }
            />
            <Route
               path="/addnew"
               element={<RAddRestaurant setRestaurants={setRestaurants} />}
            />
            < Route path="/charts" element={<RCharts/>} />
         </Routes>
      </div>
   );
}

export default App;
