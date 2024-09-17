import s from "./RAddRestaurant.module.css";
import { useState } from "react";
import axios from "axios";

function RAddRestaurant({ setRestaurants }) {
  const [form, setForm] = useState({
    name: "",
    cuisine: "",
    borough: "",
    street: "",
    building: "",
    zipcode: "",
    coord: "",
    restaurant_id: "",
    grades: [
      {
        date: "",
        grade: "",
        score: "",
      },
    ],
  });

  function handleAddChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  function handleGradeChange(index, event) {
    const newGrades = [...form.grades];
    newGrades[index][event.target.name] = event.target.value;
    setForm({ ...form, grades: newGrades });
  }

  function addGrade() {
    setForm({
      ...form,
      grades: [
        ...form.grades,
        {
          date: "",
          grade: "",
          score: "",
        },
      ],
    });
  }

  async function handleAddClick(event) {
    event.preventDefault();

    const coordsArray =
      typeof form.coord === "string" && form.coord.length > 0
        ? form.coord.split(",").map(Number)
        : [];

    const newRestaurant = {
      name: form.name,
      cuisine: form.cuisine,
      borough: form.borough,
      address: {
        street: form.street,
        building: form.building,
        zipcode: form.zipcode,
        coord: coordsArray,
      },
      restaurant_id: form.restaurant_id,
      grades: form.grades.map((grade) => ({
        date: grade.date,
        grade: grade.grade,
        score: Number(grade.score),
      })),
    };

    try {
      const response = await axios.post(
        `https://basic-server-express-production.up.railway.app/restaurants/create`,
        newRestaurant
      );

      const updatedRestaurants = await axios.get(
        "https://basic-server-express-production.up.railway.app/restaurants/all"
      );
      setRestaurants(updatedRestaurants.data);

      setForm({
        name: "",
        cuisine: "",
        borough: "",
        street: "",
        building: "",
        zipcode: "",
        coord: "",
        restaurant_id: "",
        grades: [
          {
            date: "",
            grade: "",
            score: "",
          },
        ],
      });

      console.log(response.data);
    } catch (error) {
      console.error("Error creating restaurant", error);
    }
  }

  return (
    <div className={s.editFieldContainer}>
      <form className={s.editForm}>
        <div className={s.title}>
          <b>Add new restaurant</b>
        </div>

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
            onChange={handleAddChange}
          />
        </div>

        <div className={s.editInfoContainer}>
          <label>Cuisine</label>
          <input
            className={s.inputCuisine}
            type="text"
            name="cuisine"
            value={form.cuisine}
            onChange={handleAddChange}
          />

          <label>Borough</label>
          <input
            className={s.inputBorough}
            type="text"
            name="borough"
            value={form.borough}
            onChange={handleAddChange}
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
            onChange={handleAddChange}
          />
          <label>Building</label>
          <input
            className={s.inputBuilding}
            type="text"
            name="building"
            value={form.building}
            onChange={handleAddChange}
          />
        </div>

        <label>Zip Code</label>
        <input
          className={s.inputZipcode}
          type="text"
          name="zipcode"
          value={form.zipcode}
          onChange={handleAddChange}
        />

        <label>Coord (Latitude, Longitude)</label>
        <input
          className={s.inputCoord}
          type="text"
          name="coord"
          value={form.coord}
          onChange={handleAddChange}
        />

        <label>Restaurant ID</label>
        <input
          className={s.inputRestaurantId}
          type="text"
          name="restaurant_id"
          value={form.restaurant_id}
          onChange={handleAddChange}
        />

        <label>
          <b>Grades</b>
        </label>
        {form.grades.map((grade, index) => (
          <div key={index} className={s.gradeContainer}>
            <label>Date</label>
            <input
              className={s.inputGradeDate}
              type="date"
              name="date"
              value={grade.date}
              onChange={(event) => handleGradeChange(index, event)}
            />

            <label>Grade</label>
            <input
              className={s.inputGrade}
              type="text"
              name="grade"
              value={grade.grade}
              onChange={(event) => handleGradeChange(index, event)}
            />

            <label>Score</label>
            <input
              className={s.inputScore}
              type="number"
              name="score"
              value={grade.score}
              onChange={(event) => handleGradeChange(index, event)}
            />
          </div>
        ))}

        <button type="button" className={s.addGradeButton} onClick={addGrade}>
          + Add Grade
        </button>

        <div className={s.saveDeleteContainer}>
          <button className={s.saveButton} onClick={handleAddClick}>
            Save Restaurant
          </button>
        </div>
      </form>
    </div>
  );
}

export default RAddRestaurant;
