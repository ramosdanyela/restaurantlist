import s from "./RHomePage.module.css";
import { useState } from "react";
import RCards from "../../components/RCards/RCards";
import RSearchForm from "../../components/RSearchForm/RSearchForm";

function RHomePage({ loading, setLoading, restaurants, setRestaurants}) {
  const [search, setSearch] = useState("");
  const [cuisine, setCuisine] = useState(null);
  const [sortBy, setSortBy] = useState("");

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
        loading={loading}
        setLoading={setLoading}
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
