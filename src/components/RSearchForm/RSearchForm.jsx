import s from "./RSearchForm.module.css";
import { useState, useEffect } from "react";
import axios from "axios";

function RSearchForm({
   search,
   setSearch,
   cuisine,
   setCuisine,
   setSortBy,
   sortBy,
   setRestaurants,
   restaurants = [],
   loading,
   setLoading,
}) {
   useEffect(() => {
      setLoading(true);
      async function fetchData() {
         try {
            const response = await axios.get(
               "https://basic-server-express-production.up.railway.app/restaurants/all"
            );
            setRestaurants(response.data);
            setLoading(false);
         } catch (error) {
            console.error("Error fetching data", error);
            setLoading(false);
         }
      }
      fetchData();
   }, [setRestaurants]);

   const handleSearchChange = (event) => {
      setSearch(event.target.value);
   };

   const handleCuisineChange = (event) => {
      setCuisine(event.target.value);
   };

   const handleSortChange = (sortType) => {
      setSortBy(sortType);
   };

   const uniqueCuisines = Array.from(
      new Set(
         restaurants && restaurants.length > 0
            ? restaurants.map((restaurant) => restaurant.cuisine)
            : []
      )
   ).sort((a, b) => b - a);

   return (
      <>
         {loading && <p>Loading..</p>}
         {!loading && (
            <div className="">
               <form className="">
                  <input
                     type="text"
                     placeholder="Search..."
                     value={search}
                     onChange={handleSearchChange}
                     className=""
                  />
                  <select
                     value={cuisine}
                     onChange={handleCuisineChange}
                     className=""
                  >
                     <option key="x" value="x">
                        Select Cuisine
                     </option>
                     {uniqueCuisines.map((cuisine) => (
                        <option key={cuisine} value={cuisine}>
                           {cuisine}
                        </option>
                     ))}
                  </select>
               </form>
               <div className="">
                  <span className="" onClick={() => handleSortChange("score")}>
                     Sort by Score
                  </span>
                  <span
                     className=""
                     onClick={() => handleSortChange("borough")}
                  >
                     Sort by Borough
                  </span>
               </div>
            </div>
         )}
      </>
   );
}

export default RSearchForm;
