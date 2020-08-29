import React, { useEffect, createContext, useReducer, useContext } from "react";
import NavBar from "./components/Navbar";
import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  useHistory,
} from "react-router-dom";
import Home from "./components/screens/Home";
import Singin from "./components/screens/Singin";
import Singup from "./components/screens/Singup";
import Profile from "./components/screens/Profile";
import CreatePost from "./components/screens/CreatePost";
import { reducer, initialState } from "./reducers/UserReducer";
import UserProfile from "./components/screens/UserProfile";
import SuscribePost from "./components/screens/SuscribePost";
export const userContext = createContext();

const Routing = () => {
  const history = useHistory();
  const { state, dispatch } = useContext(userContext);
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      dispatch({ type: "USER", payload: user });
    } else {
      history.push("/singin");
    }
  }, []);
  return (
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <Route path="/singin">
        <Singin />
      </Route>
      <Route path="/singup">
        <Singup />
      </Route>
      <Route exact path="/profile">
        <Profile />
      </Route>
      <Route path="/profile/:userid">
        <UserProfile />
      </Route>
      <Route path="/createpost">
        <CreatePost />
      </Route>
      <Route path="/myfolloringpost">
        <SuscribePost />
      </Route>
    </Switch>
  );
};

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <userContext.Provider value={{ state, dispatch }}>
      <Router>
        <NavBar />
        <Routing />
      </Router>
    </userContext.Provider>
  );
}

export default App;
