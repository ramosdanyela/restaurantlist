import s from "./RNavbar.module.css";
import icon from "../../../public/icon.svg";
import { Link } from "react-router-dom";

function RNavbar() {
  return (
    <nav className={s.navContainer}>
      <div className={s.headlineContainer}>
        <div className="homeButton">
          <Link to="/" className={s.customlink}>
            Home
          </Link>
        </div>
        <div className={s.svgimage}>
          {" "}
          <img className={s.icon} src={icon} />
          <h1 className={s.sitetitle}>Restaurant list</h1>{" "}
        </div>{" "}
        <div className={s.newAndRandomContainer}>
          <Link to="/addnew" className={s.customlink}>
            Add new restaurant
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default RNavbar;
