import s from "./RCards.module.css";
import { useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function RCards({
  search,
  cuisine,
  sortBy,
  loading,
  setLoading,
  restaurants,
  setRestaurants,
}) {
  useEffect(() => {
    setLoading(true);
    async function fetchData() {
      try {
        const response = await axios.get(
          "https://basic-server-express-production.up.railway.app/restaurants/all"
        );
        const restaurantsWithAverage = response.data.map((restaurant) => {
          const totalScores = restaurant.grades.reduce(
            (acc, grade) => acc + grade.score,
            0
          );
          const averageScore =
            restaurant.grades.length > 0
              ? totalScores / restaurant.grades.length
              : 0;
          return { ...restaurant, averageScore };
        });
        setRestaurants(restaurantsWithAverage);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data", error);
        setLoading(false);
      }
    }
    fetchData();
  }, [setLoading, setRestaurants]);

  const sortedRestaurants = () => {
    let sortedList = [...restaurants];

    if (sortBy === "score") {
      sortedList = sortedList.sort((a, b) => b.averageScore - a.averageScore);
    } else if (sortBy === "borough") {
      sortedList = sortedList.sort((a, b) =>
        a.borough.localeCompare(b.borough)
      );
    }

    return sortedList;
  };

  return (
    <>
      {loading && <p>Loading..</p>}
      {!loading && restaurants.length === 0 && <p>No restaurants found</p>}
      {!loading && restaurants.length > 0 && (
        <div className="flex-auto flex-col items-start bg-[#3d423c] pt-[180px] mt-[80px]">
          {sortedRestaurants()
            .filter((restaurant) =>
              restaurant.name.toLowerCase().includes(search.toLowerCase())
            )
            .filter((restaurant) =>
              cuisine ? restaurant.cuisine === cuisine : true
            )
            .map((restaurant) => (
              <Link
                to={`/restaurant/${restaurant._id}`}
                className="text-[#333] no-underline hover:[#f8f8f8]"
                key={restaurant._id}
              >
                <div className="flex-auto rounded-xl text-[#e2cb92] flex-col items-start justify-start p-[20px] m-[10px] w-[600px] bg-[#3d423c] shadow-[#50d71e] transition ease-in-out delay-150 over:-translate-y-1 hover:scale-110 duration-300">
                  <p className="flex-auto text-[30px] font-bold text-[#e2cb92] items-start m-0 p-0 mt-[10px] pb-[10px]">
                    {restaurant.name}
                  </p>
                  <div className="flex-auto text-[#b3a176] flex-col text-[16px] leading-none">
                    <p>
                      Average score:{" "}
                      {Number.isFinite(restaurant.averageScore)
                        ? restaurant.averageScore.toFixed(1)
                        : "N/A"}
                    </p>
                    <p>Cuisine: {restaurant.cuisine}</p>
                    <p>Borough: {restaurant.borough}</p>
                  </div>
                </div>
              </Link>
            ))}
        </div>
      )}
    </>
  );
}

export default RCards;
