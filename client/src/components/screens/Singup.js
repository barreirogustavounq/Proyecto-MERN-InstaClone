import React, { useState, useEffect } from "react";
import "../../App.css";
import { Link, useHistory } from "react-router-dom";
import M from "materialize-css";
const Singup = () => {
  const history = useHistory();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setpassword] = useState("");
  const [image, setImage] = useState(undefined);
  useEffect(() => {
    if (image) {
      console.log(image);
      uploadFiedls();
    }
  }, [image]);
  const uploadProfileImage = () => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "insta-clon-GB");
    data.append("cloud_name", "instaclongbarreiro");
    fetch("https://api.cloudinary.com/v1_1/instaclongbarreiro/image/upload", {
      method: "POST",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setImage(data.url);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const uploadFiedls = () => {
    if (
      !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        email
      )
    ) {
      M.toast({ html: "invalid email", classes: "#c62828 red darken-3" });
    } else {
      fetch("/singup", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          image,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            M.toast({ html: data.error, classes: "#c62828 red darken-3" });
          } else {
            M.toast({
              html: data.message,
              classes: "#388e3c green darken-2",
            });
            history.push("/singin");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  const PostData = () => {
    if (image) {
      uploadProfileImage();
    } else {
      uploadFiedls();
    }
  };

  return (
    <div className="mycard">
      <div className="card auth-card input-field">
        <h2 className="logo-login">Instagram</h2>

        <input
          type="text"
          placeholder="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
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
        <div className="file-field input-field">
          <div className="btn #64b5f6 blue darken-1">
            <span>Upload Image</span>
            <input
              type="file"
              onChange={(e) => {
                setImage(e.target.files[0], console.log(image));
              }}
            />
          </div>
          <div className="file-path-wrapper">
            <input className="file-path validate" type="text" />
          </div>
        </div>
        <button
          className="btn waves-effect waves-light #64b5f6 blue darken-1"
          onClick={() => PostData()}
        >
          Singup
        </button>
        <h5>
          <Link to="/singin">Already have an acount ?</Link>
        </h5>
      </div>
    </div>
  );
};

export default Singup;
