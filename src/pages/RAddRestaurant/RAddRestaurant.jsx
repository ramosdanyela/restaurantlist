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

      setRestaurants(response.data);

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
    } catch (error) {
      console.error("Error creating restaurant", error);
    }
  }

  return (
    <div className="flex flex-col items-center justify-start p-[20px] mt-[180px] bg-[#3d423c] gap-[20px] min-h-[100vh]">
      <form className="flex flex-col items-start gap-[15px] p-[20px] bg-[#dedfc5] rounded-md max-w-[400px] w-full">
        <div className="text-[#OOOOOO] text-left text-[25px]">
          <b>Add new restaurant</b>
        </div>

        <label className="flex flex-col items-start gap-[2px] p-[2px] bg-[#dedfc5] rounded-md max-w[400px] w-full">
          <b>General Info</b>
        </label>

        <div className="flex flex-row items-center w-full">
          <label className="flex flex-col items-start gap-[2px] p-[2px] bg-[#dedfc5] rounded-md max-w[400px] w-full">
            Name
          </label>
          <input
            className="flex justify-end w-full p-[5px] text-[#3d423c] rounded-md bg-[#FFFFFF] text-[1rem] text-right"
            name="name"
            value={form.name}
            onChange={handleAddChange}
          />
        </div>

        <div className="flex flex-row items-center w-full">
          <label className="flex flex-col items-start gap-[2px] p-[2px] bg-[#dedfc5] rounded-md max-w[400px] w-full">
            Cuisine
          </label>
          <input
            className="flex justify-end w-full p-[5px] text-[#3d423c] rounded-md bg-[#FFFFFF] text-[1rem] text-right"
            type="text"
            name="cuisine"
            value={form.cuisine}
            onChange={handleAddChange}
          />
        </div>
        <div className="flex flex-row items-center w-full">
          <label className="flex flex-col items-start gap-[2px] p-[0px] bg-[#dedfc5] rounded-md max-w[400px] w-full">
            Borough
          </label>
          <input
            className="flex justify-end w-full p-[5px] text-[#3d423c] rounded-md bg-[#FFFFFF] text-[1rem] text-right"
            type="text"
            name="borough"
            value={form.borough}
            onChange={handleAddChange}
          />
        </div>

        <label className="flex flex-col items-start gap-[2px] p-[2px] bg-[#dedfc5] rounded-md max-w[400px] w-full">
          <b>Address</b>
        </label>

        <div className="flex flex-row items-center w-full">
          <label className="flex flex-col items-start gap-[2px] p-[0px] bg-[#dedfc5] rounded-md max-w[400px] w-full">
            Street
          </label>
          <input
            className="flex justify-end w-full p-[5px] text-[#3d423c] rounded-md bg-[#FFFFFF] text-[1rem] text-right"
            type="text"
            name="street"
            value={form.street}
            onChange={handleAddChange}
          />
        </div>
        <div className="flex flex-row items-center w-full">
          <label className="flex flex-col items-start gap-[2px] p-[0px] bg-[#dedfc5] rounded-md max-w[400px] w-full">
            Building
          </label>
          <input
            className="flex justify-end w-full p-[5px] text-[#3d423c] rounded-md bg-[#FFFFFF] text-[1rem] text-right"
            type="text"
            name="building"
            value={form.building}
            onChange={handleAddChange}
          />
        </div>

        <div className="flex flex-row items-center w-full">
          <label className="flex flex-col items-start gap-[2px] p-[0px] bg-[#dedfc5] rounded-md max-w[400px] w-full">
            Zip Code
          </label>
          <input
            className="flex justify-end w-full p-[5px] text-[#3d423c] rounded-md bg-[#FFFFFF] text-[1rem] text-right"
            type="text"
            name="zipcode"
            value={form.zipcode}
            onChange={handleAddChange}
          />
        </div>
        <div className="flex flex-row items-center w-full">
          <label className="flex flex-col items-start gap-[2px] p-[0px] bg-[#dedfc5] rounded-md max-w[400px] w-full">
            Coord (Latitude, Longitude)
          </label>
          <input
            className="flex justify-end w-full p-[5px] text-[#3d423c] rounded-md bg-[#FFFFFF] text-[1rem] text-right"
            type="text"
            name="coord"
            value={form.coord}
            onChange={handleAddChange}
          />
        </div>
        <div className="flex flex-row items-center w-full">
          <label className="flex flex-col items-start gap-[2px] p-[0px] bg-[#dedfc5] rounded-md max-w[400px] w-full">
            Restaurant ID
          </label>
          <input
            className="flex justify-end w-full p-[5px] text-[#3d423c] rounded-md bg-[#FFFFFF] text-[1rem] text-right"
            type="text"
            name="restaurant_id"
            value={form.restaurant_id}
            onChange={handleAddChange}
          />
        </div>
        <div className="flex flex-row w-full">
          <label className="flex items-start gap-[10px] p-[15px] bg-[#dedfc5] rounded-md max-w[400px] w-full">
            <b>Grades</b>
          </label>
          <button
            type="button"
            className=" w-full bg-[blue] flex-row rounded-md px-5 py-2.5 text-[#FFFFFF]"
            onClick={addGrade}
          >
            + Add Grade
          </button>{" "}
        </div>
        {form.grades.map((grade, index) => (
          <div key={index} className="w-full flex flex-col gap-[5px]">
            <div className="flex flex-row items-center w-full">
              <label className="flex flex-col items-start gap-[2px] p-[0px] bg-[#dedfc5] rounded-md max-w[400px] w-full">
                Date
              </label>
              <input
                className="flex w-full justify-end w-full p-[5px] text-[#3d423c] rounded-md bg-[#FFFFFF] text-[1rem] text-right"
                type="date"
                name="date"
                value={grade.date}
                onChange={(event) => handleGradeChange(index, event)}
              />
            </div>
            <div className="flex flex-row items-center">
              <label className="flex flex-col items-start gap-[2px] p-[0px] bg-[#dedfc5] rounded-md max-w[400px] w-full">
                Grade
              </label>
              <input
                className="flex justify-end w-full p-[5px] text-[#3d423c] rounded-md bg-[#FFFFFF] text-[1rem] text-right"
                type="text"
                name="grade"
                value={grade.grade}
                onChange={(event) => handleGradeChange(index, event)}
              />
            </div>
            <div className="flex flex-row items-center">
              <label className="flex flex-col items-start gap-[2px] p-[0px] bg-[#dedfc5] rounded-md max-w[400px] w-full">
                Score
              </label>
              <input
                className="flex justify-end w-full p-[5px] text-[#3d423c] rounded-md bg-[#FFFFFF] text-[1rem] text-right"
                type="number"
                name="score"
                value={grade.score}
                onChange={(event) => handleGradeChange(index, event)}
              />
            </div>
          </div>
        ))}

        <div className="flex w-full flex-col justify-center">
          <button
            className="bg-[#4caf50] no-border rounded-md text-[#FFFFFF] px-5 py-2.5 text-[1.2rem] font-bold cursor-pointer w-full"
            onClick={handleAddClick}
          >
            Save Restaurant
          </button>
        </div>
      </form>
    </div>
  );
}

export default RAddRestaurant;
