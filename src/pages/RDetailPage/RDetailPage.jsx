import s from "./RDetailPage.module.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

function RDetailPage({ loading, setLoading }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [isEditVisible, setIsEditVisible] = useState(false);
  const toggleEditButton = () => {
    setIsEditVisible(!isEditVisible);
  };

  const [restaurant, setRestaurant] = useState({});
  const [form, setForm] = useState({
    name: "",
    street: "",
    building: "",
    zipcode: "",
    cuisine: "",
    borough: "",
    coord: [],
  });

  useEffect(() => {
    setLoading(true);
    async function fetchData() {
      try {
        const response = await axios.get(
          `https://basic-server-express-production.up.railway.app/restaurants/${id}`
        );
        let restaurant = response.data;
        const totalScores = restaurant.grades.reduce(
          (acc, grade) => acc + grade.score,
          0
        );
        const averageScore =
          restaurant.grades.length > 0
            ? totalScores / restaurant.grades.length
            : 0;

        // Adicionar a média ao estado do restaurante
        setRestaurant({ ...restaurant, averageScore });
        setForm({
          name: restaurant.name || "",
          street: restaurant.address?.street || "",
          building: restaurant.address?.building || "",
          zipcode: restaurant.address?.zipcode || "",
          cuisine: restaurant.cuisine || "",
          borough: restaurant.borough || "",
          coord: restaurant.address?.coord || [],
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data", error);
        setLoading(false);
      }
    }
    fetchData();
  }, [id, setLoading]);

  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function handleSaveClick(event) {
    event.preventDefault();
    try {
      const response = await axios.put(
        `https://basic-server-express-production.up.railway.app/restaurants/update/${id}`,
        { ...form }
      );
      setIsEditVisible(false);
      setRestaurant(response.data);
    } catch (error) {
      console.error("Error updating restaurant", error);
    }
  }

  async function handleDeleteClick(event) {
    event.preventDefault();
    try {
      const response = await axios.delete(
        `https://basic-server-express-production.up.railway.app/restaurants/delete/${id}`
      );
      navigate("/");
    } catch (error) {
      console.error("Error deleting restaurant", error);
    }
  }

  return (
    <div className="flex flex-col items-center">
      <div className="flex-col inline-block items-center p-[10px] bg-[#3d423c] text-[#dedfc5] mt-[180px] mb-[20px] gap-[20px] shadow-[0_4px_8px_rgba(0,0,0,0.1)]">
        {loading && <p>Loading...</p>}
        {!loading && (
          <>
            <div className="text-center mb-[20px]">
              <div className="text-[3rem] font-bold text-[#dedfc5]">
                {restaurant.name}
              </div>
              <div className="">
                <i> restaurant_id: {restaurant.restaurant_id}</i>
              </div>
            </div>
            <div className="text-[1rem] text-[#dedfc5] flex mb-[10px] flex-col">
              <div className=""> General Info</div>
              <div>
                {" "}
                <b>Avg Score:</b> {restaurant.averageScore}{" "}
              </div>
              <div>
                {" "}
                <b>Cuisine:</b> {restaurant.cuisine}
              </div>
              <div>
                {" "}
                <b>Borough:</b> {restaurant.borough}
              </div>
              <div>
                {" "}
                <b>__v:</b> {restaurant.__v}
              </div>
            </div>

            <div className="flex flex-col mb-[20px] mt-[20px]">
              <div className="font-bold text-[2rem] mb-[5px]">Address</div>
              <div>Street: {restaurant.address?.street || "N/A"}</div>
              <div>Building: {restaurant.address?.building || "N/A"}</div>
              <div>Zip Code: {restaurant.address?.zipcode || "N/A"}</div>
              <div>
                Coord:{" "}
                {restaurant.address?.coord
                  ? `"${restaurant.address.coord[0]}", "${restaurant.address.coord[1]}"`
                  : "N/A"}
              </div>
            </div>

            <div className="">
              <div className="font-bold text-[2rem] mb-[5px]">Grades</div>
              {restaurant.grades?.length > 0 ? (
                restaurant.grades.map((grade) => (
                  <div className="flex flex-col mb-[10px]" key={grade._id}>
                    <div>
                      {" "}
                      Date: {new Date(grade.date).toLocaleDateString()}
                    </div>
                    <div> grade: {grade.grade} </div>
                    <div> score: {grade.score} </div>
                    <div>
                      <i>id: {grade._id}</i>
                    </div>
                  </div>
                ))
              ) : (
                <p>No grades available</p>
              )}
            </div>

            <div className="mt-[30px] flex justify-center">
              <button
                className="p-[10px] bg-[#dedfc5] rounded-md text-[#3d423c] text-[1.2rem] font-bold cursor-pointer transition-colors duration-300 ease"
                onClick={toggleEditButton}
              >
                Edit Restaurant
              </button>
            </div>

            {isEditVisible && (
              <div className="">
                <form className="flex flex-col gap-[15px mt-[10px] p-[20px] bg-[#dedfc5] rounded-md w-full max-w-md">
                  <label>
                    <b>General Info</b>
                  </label>
                  <div className="">
                    <label>Name</label>
                    <input
                      className="flex bg-[#FFFFFF] justify-end text-[#000000] w-full p-[5px] rounded-md text-[1rem] text-right border border-[#ccc]"
                      type="text"
                      placeholder="Restaurant name"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="">
                    <label>Cuisine</label>
                    <input
                      className="flex bg-[#FFFFFF] justify-end text-[#000000] w-full p-[5px] rounded-md text-[1rem] text-right border border-[#ccc]"
                      type="text"
                      name="cuisine"
                      value={form.cuisine}
                      onChange={handleChange}
                    />

                    <label> Borough</label>
                    <input
                      className="flex bg-[#FFFFFF] justify-end text-[#000000] w-full p-[5px] rounded-md text-[1rem] text-right border border-[#ccc]"
                      type="text"
                      name="borough"
                      value={form.borough}
                      onChange={handleChange}
                    />
                  </div>
                  <label>
                    <b>Address</b>
                  </label>

                  <div className="">
                    <label>Street</label>
                    <input
                      className="flex bg-[#FFFFFF] justify-end text-[#000000] w-full p-[5px] rounded-md text-[1rem] text-right border border-[#ccc]"
                      type="text"
                      name="street"
                      value={form.street}
                      onChange={handleChange}
                    />
                    <label> Building</label>
                    <input
                      className="flex bg-[#FFFFFF] justify-end text-[#000000] w-full p-[5px] rounded-md text-[1rem] text-right border border-[#ccc]"
                      type="text"
                      name="building"
                      value={form.building}
                      onChange={handleChange}
                    />
                  </div>

                  <label>Zip Code</label>
                  <input
                    className="flex bg-[#FFFFFF] justify-end text-[#000000] w-full p-[5px] rounded-md text-[1rem] text-right border border-[#ccc]"
                    type="text"
                    name="zipcode"
                    value={form.zipcode}
                    onChange={handleChange}
                  />

                  <label> Coord (Latitude, Longitude) </label>
                  <input
                    className="flex bg-[#FFFFFF] justify-end text-[#000000] w-full p-[5px] rounded-md text-[1rem] text-right border border-[#ccc]"
                    type="text"
                    name="coord"
                    value={form.coord.join(", ")}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        coord: event.target.value.split(",").map(Number),
                      })
                    }
                  />

                  <div className="flex justify-between mt-[10px]">
                    <button
                      className="bg-[#f44336] text-[#FFFFFF] px-5 py-2.5 no-border rounded-md text-[1rem] cursor-pointer w-[48%] transition-colors duration-300 ease"
                      onClick={handleDeleteClick}
                    >
                      Delete Restaurant
                    </button>
                    <button
                      className="bg-[#4caf50] text-[#FFFFFF] px-5 py-2.5 no-border rounded-md text-[1rem] cursor-pointer w-[48%] transition-colors duration-300 ease"
                      onClick={handleSaveClick}
                    >
                      Save changes
                    </button>
                  </div>
                </form>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
export default RDetailPage;
