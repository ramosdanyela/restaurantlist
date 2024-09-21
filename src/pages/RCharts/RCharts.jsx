import { useState, useEffect } from "react";
import axios from "axios";
import react from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function RCharts() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [boroughsbyCuisine, setBoroughsByCuisine] = useState([]);
  const [selectedCuisine, setSelectedCuisine] = useState("");
  const [avgScoresbyBorough, setAvgScoresbyBorough] = useState("");
  const [topRestaurants, setTopRestaurants] = useState([]);

  useEffect(() => {
    setLoading(true);
    async function fetchData() {
      try {
        const response = await axios.get(
          "https://basic-server-express-production.up.railway.app/restaurants/all"
        );

        const restaurantsWithAverage = response.data.map((restaurant) => {
          //calculate average score
          const totalScores = restaurant.grades.reduce(
            (acc, grade) => acc + grade.score,
            0
          );
          const averageScore =
            restaurant.grades.length > 0
              ? totalScores / restaurant.grades.length
              : 0;
          return { ...restaurant, averageScore }; //include avgscore in the restaurants array
        });

        const boroughScores = {}; //set function to calculate scores avg
        restaurantsWithAverage.forEach((restaurant) => {
          const borough = restaurant.borough;
          if (!boroughScores[borough]) {
            boroughScores[borough] = { totalScore: 0, count: 0 };
          }
          boroughScores[borough].totalScore += restaurant.averageScore;
          boroughScores[borough].count += 1;
        });

        const avgScores = {}; //calculate scores avg by borough
        for (const borough in boroughScores) {
          avgScores[borough] =
            boroughScores[borough].totalScore / boroughScores[borough].count;
        }

        console.log(boroughScores); //print all borough scores and count

        const cuisineBoroughCount = {}; //set function to calculate and organize cuisines by borough
        restaurantsWithAverage.forEach((restaurant) => {
          const { borough, cuisine } = restaurant;
          if (!cuisineBoroughCount[cuisine]) {
            cuisineBoroughCount[cuisine] = {};
          }
          if (!cuisineBoroughCount[cuisine][borough]) {
            cuisineBoroughCount[cuisine][borough] = 0;
          }
          cuisineBoroughCount[cuisine][borough] += 1;
        });

        findTopRestaurantsByGrades(restaurantsWithAverage);

        setRestaurants(restaurantsWithAverage);
        setBoroughsByCuisine(cuisineBoroughCount);
        setAvgScoresbyBorough(avgScores);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data", error);
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const findTopRestaurantsByGrades = (restaurants) => {
    const sortedRestaurants = [...restaurants].sort((a, b) => {
      return b.grades.length - a.grades.length; // Ordena pela quantidade de grades (em ordem decrescente)
    });

    // Pegamos os 5 primeiros ou qualquer número que você desejar
    const topTen = sortedRestaurants.slice(0, 10);
    setTopRestaurants(topTen);
  };

  const uniqueCuisines = Array.from(
    new Set(
      restaurants && restaurants.length > 0
        ? restaurants.map((restaurant) => restaurant.cuisine)
        : []
    )
  ).sort((a, b) => a.localeCompare(b));

  const handleCuisineChange = (event) => {
    setSelectedCuisine(event.target.value);
  };

  function barChart1() {
    const sortedBoroughs = Object.entries(avgScoresbyBorough).sort(
      (a, b) => b[1] - a[1] // Ordena pelo valor das médias
    );

    const labels = sortedBoroughs.map((item) => item[0]);
    const scores = sortedBoroughs.map((item) => item[1]);

    const data = {
      labels: labels,
      datasets: [
        {
          label: "Restaurants' average score by Borough ",
          data: scores,
          backgroundColor: "rgba(178, 132, 85, 0.6)",
          borderColor: "rgba(178, 132, 85, 1)",
          borderWidth: 1,
        },
      ],
    };

    const options = {
      indexAxis: "y",
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
        title: {
          display: false,
          text: "Average of Restaurants Scores by Boroughs",
        },
      },
      scales: {
        x: {
          beginAtZero: true,
        },
      },
    };

    return <Bar data={data} options={options} />;
  }

  function barChart2() {
    if (!selectedCuisine || !boroughsbyCuisine[selectedCuisine]) {
      return <p> Please select a cuisine!</p>;
    }

    const boroughData = Object.entries(boroughsbyCuisine[selectedCuisine]).sort(
      (a, b) => b[1] - a[1]
    );

    const labels = boroughData.map((item) => item[0]);
    const scores = boroughData.map((item) => item[1]);

    const data = {
      labels: labels,
      datasets: [
        {
          label: `Frequency of ${selectedCuisine} Restaurants by Borough`,
          data: scores,
          backgroundColor: "rgba(178, 132, 85, 0.6)",
          borderColor: "rgba(178, 132, 85, 1)",
          borderWidth: 1,
        },
      ],
    };

    const options = {
      indexAxis: "y",
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
        title: {
          display: false,
          text: `Frequency of ${selectedCuisine} Restaurants by Borough`,
        },
      },
      scales: {
        x: {
          beginAtZero: true,
        },
      },
    };

    return <Bar data={data} options={options} />;
  }

  function barChart3() {
    if (!topRestaurants || topRestaurants.length === 0) {
      return <p>Loading top restaurants...</p>;
    }
    const labels = topRestaurants.map((restaurant) => restaurant.name);
    const scores = topRestaurants.map((restaurant) => restaurant.grades.length);

    const data = {
      labels: labels,
      datasets: [
        {
          label: "Top 10 Restaurants by Number of Reviews",
          data: scores,
          backgroundColor: "rgba(178, 132, 85, 0.6)",
          borderColor: "rgba(178, 132, 85, 1)",
          borderWidth: 1,
        },
      ],
    };

    const options = {
      indexAxis: "y",
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
        title: {
          display: false,
          text: "Top 10 Restaurants by Number of Reviews",
        },
      },
      scales: {
        x: {
          beginAtZero: true,
        },
      },
    };

    return <Bar data={data} options={options} />;
  }

  return (
    <>
      {loading && <p>Loading..</p>}
      {!loading && (
        <div className="text-[#FFFFFF] mt-[100px] flex w-full flex-col items-center">
          <div className="font-bold text-[3rem] mb-8 flex items-center">
            Analytics
          </div>

          <div className="flex flex-wrap flex-col">
            <div className="p-[30px] mb-[20px] text-[#3d423b] rounded-xl bg-[#fff2cc] border-2 flex flex-wrap flex-col items-center place-content-between w-full">
              <h1 className="font-bold flex-row text-[2rem] mb-8 flex items-center justify-center w-full">
                What are the boroughs with best scores average?
              </h1>
              <h2 className="font-bold flex-row text-[1.2rem] mb-8 flex items-center">
                Average of Restaurants Scores by Boroughs
              </h2>
              <div className="text-[3 rem] h-[500px] w-full  flex items-center flex-col">
                {barChart1()}
              </div>
            </div>

            <div className="p-[30px] mb-[20px] text-[#3d423b] rounded-xl bg-[#fff2cc] border-2 flex flex-wrap flex-col items-center place-content-between w-full">
              <h1 className="font-bold flex-row text-[2rem] mb-8 flex items-center justify-center w-full">
                Where should I go to try this cuisine?
              </h1>
              <form>
                <select
                  value={selectedCuisine}
                  onChange={handleCuisineChange}
                  className="border-[#d1b289] border-4 mb-[10px] w-full max-w-xs px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
              <h2 className="font-bold flex-row text-[1.2rem] mb-8 flex items-center">
                Frequency of {selectedCuisine} restaurants by Borough
              </h2>
              <div className="text-[3 rem] h-[500px] w-full  flex items-center flex-col">
                {barChart2()}
              </div>
            </div>

            <div className="p-[30px] mb-[20px] text-[#3d423b] rounded-xl bg-[#fff2cc] border-2 flex flex-wrap flex-col items-center place-content-between w-full">
              <h1 className="font-bold flex-row text-[2rem] mb-8 flex items-center justify-center w-full">
                Which are the restaurants that have more reviews?
              </h1>
              <h2 className="font-bold flex-row text-[1.2rem] mb-8 flex items-center">
                Frequency of reviews by Restaurant (only top 10)
              </h2>
              <div className="text-[3 rem] h-[500px] w-full  flex items-center flex-col">
                {barChart3()}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
export default RCharts;
