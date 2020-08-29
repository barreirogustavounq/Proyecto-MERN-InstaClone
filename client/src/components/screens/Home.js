import React, { useState, useEffect, useContext } from "react";

import { userContext } from "../../App";
import { Link } from "react-router-dom";
import "../styles/Home.css";
const Home = () => {
  const [data, setData] = useState([]);
  const { state, dispatch } = useContext(userContext);
  useEffect(() => {
    fetch("/allpost", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        setData(result);
      });
  }, []);
  const likePost = (id) => {
    return fetch("/like", {
      method: "put",
      headers: {
        "content-type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(data);
        const newData = data.map((item) => {
          if (item._id === result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const unlikePost = (id) => {
    return fetch("/unlike", {
      method: "put",
      headers: {
        "content-type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        const newData = data.map((item) => {
          if (item._id === result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const makecomment = (text, postId) => {
    fetch("/comment", {
      method: "put",
      headers: {
        "Content-type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId,
        text,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        const newData = data.map((item) => {
          if (item._id === result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const deletePost = (postId) => {
    fetch(`/deletePost/${postId}`, {
      method: "delete",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        const newData = data.filter((item) => {
          return item._id !== result._id;
        });
        setData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="home" style={{ maxWidth: "550px", margin: "0px auto" }}>
      {data.map((item) => {
        return (
          <div className="card home card" key={item._id}>
            <h5>
              {" "}
              <Link
                to={
                  item.postedBy._id !== state._id
                    ? "/profile/" + item.postedBy._id
                    : "/profile"
                }
              >
                {item.postedBy.name}
              </Link>
              {item.postedBy._id === state._id && (
                <i
                  className="material-icons"
                  style={{ float: "right" }}
                  onClick={() => {
                    deletePost(item._id);
                  }}
                >
                  delete
                </i>
              )}
            </h5>
            <div className="card-image">
              <img src={item.photo} alt="post" />
            </div>
            <div className="card-content">
              {item.likes.includes(state._id) ? (
                <i
                  className="material-icons"
                  onClick={() => {
                    unlikePost(item._id);
                  }}
                  style={{ color: "red" }}
                >
                  favorite
                </i>
              ) : (
                <i
                  className="material-icons"
                  onClick={() => {
                    likePost(item._id);
                  }}
                  style={{ color: "black" }}
                >
                  favorite_border
                </i>
              )}

              <h6>{item.likes.length} likes</h6>
              <h6>{item.title}</h6>
              <p>{item.body}</p>
              {item.comments.map((record) => {
                return (
                  <h6 key={record._id} className="comment">
                    <span
                      className="commentText"
                      style={{
                        fontWeight: "500",
                      }}
                    >
                      {record.postedBy.name} :
                    </span>
                    {record.text}
                  </h6>
                );
              })}

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  makecomment(e.target[0].value, item._id);
                }}
              >
                <input type="text" placeholder="add coment" />
              </form>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Home;
