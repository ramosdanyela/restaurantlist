import s from "./RCards.module.css";
import { useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function RCards({ search, cuisine, sortBy, loading, setLoading, restaurants, setRestaurants}) {

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
          const averageScore = restaurant.grades.length > 0 ? totalScores / restaurant.grades.length: 0;
          return { ...restaurant, averageScore };
        });
console.log("Fetched Restaurants:", response.data);
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
        <div className={s.cardsMasterContainer}>
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
                className={s.customlink}
                key={restaurant._id}
              >
                <div className={s.cardContainerUnit}>
                  <p className={s.hpTitle}>{restaurant.name}</p>
                  <div className={s.hpCardBody}>
                  <p className={s.Avg}>
                    Average score: {Number.isFinite(restaurant.averageScore) 
                        ? restaurant.averageScore.toFixed(1) 
                        : "N/A"}
                  </p>
                  <p className={s.hpCuisine}>Cuisine: {restaurant.cuisine}</p>
                  <p className={s.hpBorough}>Borough: {restaurant.borough}</p>
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
