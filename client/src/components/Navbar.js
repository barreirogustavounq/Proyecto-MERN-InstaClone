import React, { useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import { userContext } from "../App";
const NavBar = () => {
  const { state, dispatch } = useContext(userContext);
  const history = useHistory();
  const renderList = () => {
    if (state) {
      return [
        <li>
          <Link to="/profile">Profile</Link>
        </li>,
        <li>
          <Link to="/createpost">Create Post</Link>
        </li>,
        <li>
          <Link to="/myfolloringpost">Following Post</Link>
        </li>,
        <li>
          <button
            className="btn #c62828 red darken-3"
            onClick={() => {
              localStorage.clear();
              dispatch({ type: "CLEAR" });
              history.push("/singin");
            }}
          >
            Singout
          </button>
        </li>,
      ];
    } else {
      return [
        <li>
          <Link to="/singin">Singin</Link>
        </li>,
        <li>
          <Link to="/singup">Singup</Link>
        </li>,
      ];
    }
  };
  return (
    <nav>
      <div className="nav-wrapper white">
        <Link to={state ? "/" : "/singin"} className="brand-logo left">
          Instagram
        </Link>
        <ul id="nav-mobile" className="right">
          {renderList()}
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;
