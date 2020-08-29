import React, { useEffect, useState, useContext } from "react";
import { userContext } from "../../App";
const Profile = () => {
  const [myPics, setPics] = useState([]);
  const { state, dispatch } = useContext(userContext);
  const [image, setImage] = useState(undefined);
  useEffect(() => {
    fetch("/mypost", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        setPics(result.mypost);
      });
  }, []);

  useEffect(() => {
    if (image) {
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
          fetch("/updateimage", {
            method: "put",
            headers: {
              "Content-type": "application/json",
              Authorization: "Bearer " + localStorage.getItem("jwt"),
            },
            body: JSON.stringify({
              image: data.url,
            }),
          })
            .then((res) => res.json())
            .then((result) => {
              console.log(result);
              localStorage.setItem(
                "user",
                JSON.stringify({ ...state, image: result.image })
              );
              dispatch({
                type: "UPDATEIMAGE",
                payload: { image: result.image },
              });
              //window.location.reload();
            });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [image]);

  const updatePhoto = (file) => {
    setImage(file);
  };

  return (
    <div style={{ maxWidth: "550px", margin: "0px auto" }}>
      <div
        style={{
          margin: "30px 0px",
          borderBottom: "1px solid grey",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
          }}
        >
          <div>
            <img
              style={{ width: "150px", height: "160px", borderRadius: "80px" }}
              src={state ? state.image : "loading..."}
              alt="ico"
            />
          </div>
          <div>
            <h4>{state ? state.name : "loading..."}</h4>
            <h5>{state ? state.email : "loading..."}</h5>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: "110%",
              }}
            >
              <h5>{myPics.length} posts</h5>
              <h5>{state ? state.followers.length : "0"} followers</h5>
              <h5>{state ? state.following.length : "0"} following</h5>
            </div>
          </div>
        </div>

        <div className="file-field input-field">
          <div className="btn #64b5f6 blue darken-1">
            <span>Update Profile Photo</span>
            <input
              type="file"
              onChange={(e) => {
                updatePhoto(e.target.files[0]);
              }}
            />
          </div>
          <div className="file-path-wrapper">
            <input className="file-path validate" type="text" />
          </div>
        </div>
      </div>
      <div className="gallery">
        {myPics.map((item) => {
          return (
            <img key={item._id} className="item" alt="photo" src={item.photo} />
          );
        })}
      </div>
    </div>
  );
};

export default Profile;
