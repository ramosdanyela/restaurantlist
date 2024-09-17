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
    <div className={s.dpMasterContainer}>
      <div className={s.dpContainer}>
        {loading && <p>Loading...</p>}
        {!loading && (
          <>
            <div className={s.dpTitleIdContainer}>
              <div className={s.dpTitle}>{restaurant.name}</div>
              <div className={s.dpId_}>
                <i> restaurant_id: {restaurant.restaurant_id}</i>
              </div>
            </div>
            <div className={s.genInfo}>
              <div className={s.subTitle}> General Info</div>
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

            <div className={s.Address}>
              <div className={s.subTitle}>Address</div>
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

            <div className={s.gradesContainer}>
              <div className={s.subTitle}>Grades</div>
              {restaurant.grades?.length > 0 ? (
                restaurant.grades.map((grade) => (
                  <div className={s.gradeContainerUnit} key={grade._id}>
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

            <div className={s.editButtonContainer}>
              <button className={s.editButton} onClick={toggleEditButton}>
                Edit Restaurant
              </button>
            </div>

            {isEditVisible && (
              <div className={s.editFieldContainer}>
                <form className={s.editForm}>
                  <label>
                    <b>General Info</b>
                  </label>
                  <div className={s.editNameContainer}>
                    <label>Name</label>
                    <input
                      className={s.inputName}
                      type="text"
                      placeholder="Restaurant name"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                    />
                  </div>

                  <div className={s.editInfoContainer}>
                    <label>Cuisine</label>
                    <input
                      className={s.inputCuisine}
                      type="text"
                      name="cuisine"
                      value={form.cuisine}
                      onChange={handleChange}
                    />

                    <label> Borough</label>
                    <input
                      className={s.inputBorough}
                      type="text"
                      name="borough"
                      value={form.borough}
                      onChange={handleChange}
                    />
                  </div>
                  <label>
                    <b>Address</b>
                  </label>

                  <div className={s.editAdress}>
                    <label>Street</label>
                    <input
                      className={s.inputStreet}
                      type="text"
                      name="street"
                      value={form.street}
                      onChange={handleChange}
                    />
                    <label> Building</label>
                    <input
                      className={s.inputBuilding}
                      type="text"
                      name="building"
                      value={form.building}
                      onChange={handleChange}
                    />
                  </div>

                  <label>Zip Code</label>
                  <input
                    className={s.inputZipcode}
                    type="text"
                    name="zipcode"
                    value={form.zipcode}
                    onChange={handleChange}
                  />

                  <label> Coord (Latitude, Longitude) </label>
                  <input
                    className={s.inputCoord}
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

                  <div className={s.saveDeleteContainer}>
                    <button
                      className={s.deleteButton}
                      onClick={handleDeleteClick}
                    >
                      Delete Restaurant
                    </button>
                    <button className={s.saveButton} onClick={handleSaveClick}>
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
