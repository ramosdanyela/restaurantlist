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
        <div className="flex flex-col justify-evenly items-center w-full bg-[#3d423c] mt-0 pt-[60px] pb-[10px] fixed">
          <form className="flex flex-row justify-between gap-[20px]">
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={handleSearchChange}
              className="flex-auto flex-col w-[65%] p-[10px] border-solid bg-[#FFFFFF] text-[#3d423c] rounded-md text-[1rem]"
            />
            <select
              value={cuisine}
              onChange={handleCuisineChange}
              className="w-[30%] p-[10px] border-solid bg-[#FFFFFF] text-[#000000] rounded-md text-[1rem]"
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
          <div className="mt-[10px] text-[#FFFFFF]">
            <span
              className="mr-[20px] cursor-pointer"
              onClick={() => handleSortChange("score")}
            >
              Sort by Score
            </span>
            <span
              className="mr-[20px] cursor-pointer"
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
