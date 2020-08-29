import React, { useEffect, useState, useContext } from "react";
import { userContext } from "../../App";
import { useParams } from "react-router-dom";

const Profile = () => {
  const [userProfile, setUserProfile] = useState(null);
  const { state, dispatch } = useContext(userContext);
  const { userid } = useParams();
  const [showFollow, setShowfollow] = useState(true);
  //   console.log(userid);
  useEffect(() => {
    fetch(`/user/${userid}`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setUserProfile(result);
      });
  }, []);

  const followUser = () => {
    if (showFollow) {
      fetch("/follow", {
        method: "put",
        headers: {
          "Content-type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
        body: JSON.stringify({
          followId: userid,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          //console.log(data);
          dispatch({
            type: "UPDATE",
            payload: { following: data.following, followers: data.followers },
          });
          localStorage.setItem("user", JSON.stringify(data));
          setUserProfile((prevState) => {
            //console.log(prevState);
            return {
              ...prevState,
              user: {
                ...prevState.user,
                followers: [...prevState.user.followers, data._id],
              },
            };
          });
          console.log(userProfile);
        });
      setShowfollow(false);
    }
  };

  const unfollowUser = () => {
    fetch("/unfollow", {
      method: "put",
      headers: {
        "Content-type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        unfollowId: userid,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        //console.log(data);
        dispatch({
          type: "UPDATE",
          payload: { following: data.following, followers: data.followers },
        });
        localStorage.setItem("user", JSON.stringify(data));

        setUserProfile((prevState) => {
          const newfollower = prevState.user.followers.filter(
            (item) => item != data._id
          );

          return {
            ...prevState,
            user: {
              ...prevState.user,
              followers: newfollower,
            },
          };
        });
        console.log(userProfile);
      });
    setShowfollow(true);
  };

  return (
    <>
      {userProfile ? (
        <div style={{ maxWidth: "550px", margin: "0px auto" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              margin: "30px 0px",
              borderBottom: "1px solid grey",
            }}
          >
            <div>
              <img
                style={{
                  width: "150px",
                  height: "160px",
                  borderRadius: "80px",
                }}
                src={userProfile.user.image}
                alt="ico"
              />
            </div>
            <div>
              <h4>{userProfile.user.name}</h4>
              <h5>{userProfile.user.email}</h5>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "110%",
                }}
              >
                {console.log(userProfile)}
                {console.log(state)}
                <h5>{userProfile.posts.length} posts</h5>
                <h5>{userProfile.user.followers.length} followers</h5>
                <h5>{userProfile.user.following.length} following</h5>
              </div>
              {!userProfile.user.followers.includes(state._id) ? (
                <button
                  style={{ margin: "10px" }}
                  className="btn waves-effect waves-light #64b5f6 blue darken-1"
                  onClick={() => followUser()}
                >
                  Follow
                </button>
              ) : (
                <button
                  style={{ margin: "10px" }}
                  className="btn waves-effect waves-light #64b5f6 blue darken-1"
                  onClick={() => unfollowUser()}
                >
                  Unfollow
                </button>
              )}
            </div>
          </div>
          <div className="gallery">
            {userProfile.posts.map((item) => {
              return (
                <img
                  key={item._id}
                  className="item"
                  alt="photo"
                  src={item.photo}
                />
              );
            })}
          </div>
        </div>
      ) : (
        <h2> loading...!</h2>
      )}
    </>
  );
};

export default Profile;
