const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/keys");
const mongoose = require("mongoose");
const User = mongoose.model("User");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  //console.log(authorization);
  if (!authorization) {
    return res.status(401).json({ error: "you must be logged in 1" });
  }
  const token = authorization.replace("Bearer ", "");
  //console.log(token);
  jwt.verify(token, JWT_SECRET, (err, payload) => {
    if (err) {
      return res.status(401).json({ error: "you must be logged in 2" });
    }
    //console.log(payload);
    const { id } = payload;
    User.findById(id).then((userdata) => {
      req.user = userdata;
      //console.log(userdata);
      next();
    });
  });
};
