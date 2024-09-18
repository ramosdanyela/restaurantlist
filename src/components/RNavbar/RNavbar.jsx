import s from "./RNavbar.module.css";
import icon from "../../../public/icon.svg";
import { Link } from "react-router-dom";

function RNavbar() {
   return (
      <nav className="">
         <div className="">
            <div className="">
               <Link to="/" className="">
                  Home
               </Link>
            </div>
            <div className="">
               {" "}
               <img className="" src={icon} />
               <h1 className="">Restaurant list</h1>{" "}
            </div>{" "}
            <div className="">
               <Link to="/addnew" className="">
                  Add new restaurant
               </Link>
            </div>
         </div>
      </nav>
   );
}

export default RNavbar;
