import React, { useState, useContext } from "react";
import "../../App.css";
import { Link, useHistory } from "react-router-dom";
import M from "materialize-css";
import { userContext } from "../../App";
const Login = () => {
  const { state, dispatch } = useContext(userContext);
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setpassword] = useState("");

  const PostData = () => {
    if (
      !/^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        email
      )
    ) {
      M.toast({ html: "invalido email", classes: "#c62828 red darken-3" });
    } else {
      fetch("/singin", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          if (data.error) {
            M.toast({ html: data.error, classes: "#c62828 red darken-3" });
          } else {
            localStorage.setItem("jwt", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
            dispatch({ type: "USER", payload: data.user });

            M.toast({
              html: "signed success",
              classes: "#388e3c green darken-2",
            });
            history.push("/");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  return (
    <div className="mycard">
      <div className="card auth-card input-field">
        <h2 className="logo-login">Instagram</h2>
        <input
          type="text"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setpassword(e.target.value)}
        />
        <button
          className="btn waves-effect waves-light #64b5f6 blue darken-1"
          onClick={() => PostData()}
        >
          Singin
        </button>
        <h5>
          <Link to="/singup">Don't have an acount ?</Link>
        </h5>
      </div>
    </div>
  );
};

export default Login;
