import s from "./RHomePage.module.css";
import { useState } from "react";
import RCards from "../../components/RCards/RCards";
import RSearchForm from "../../components/RSearchForm/RSearchForm";

function RHomePage({ loading, setLoading }) {
  const [search, setSearch] = useState("");
  const [cuisine, setCuisine] = useState(null);
  const [sortBy, setSortBy] = useState("");
  const [restaurants, setRestaurants] = useState([]);

  return (
    <div className={s.homePageContainer}>
      <RSearchForm
        search={search}
        setSearch={setSearch}
        cuisine={cuisine}
        setCuisine={setCuisine}
        sortBy={sortBy}
        setSortBy={setSortBy}
        setRestaurants={setRestaurants}
        restaurants={restaurants}
      />
      <RCards
        search={search}
        cuisine={cuisine}
        sortBy={sortBy}
        loading={loading}
        setLoading={setLoading}
        restaurants={restaurants}
        setRestaurants={setRestaurants}
      />{" "}
    </div>
  );
}

export default RHomePage;
