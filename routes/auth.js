const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const User = mongoose.model("User");

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const { JWT_SECRET } = require("../config/keys");

const requiredLogin = require("../middleware/requiredLogin");

router.post("/singup", (req, res) => {
  const { name, email, password, image } = req.body;
  if (!email || !password || !name) {
    return res.status(422).json({ error: "llenar todos los campos" });
  }
  User.findOne({ email: email })
    .then((savedUser) => {
      if (savedUser) {
        return res.status(422).json({ error: "el usuario ya existe" });
      }
      bcrypt.hash(password, 12).then((hashedpassword) => {
        const user = new User({
          email,
          password: hashedpassword,
          name,
          image,
        });
        user
          .save()
          .then((user) => {
            res.json({ message: "guardado exitosamente" });
          })
          .catch((err) => {
            console.log(err);
          });
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/singin", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(422).json({ error: "Por favor ingrasa email o password" });
  }
  User.findOne({ email })
    .then((savedUser) => {
      if (!savedUser) {
        res.status(422).json({ error: "Invalid Email o Password" });
      }
      bcrypt
        .compare(password, savedUser.password)
        .then((doMatch) => {
          if (doMatch) {
            //res.json({ message: "Succefully signed in" });
            const token = jwt.sign({ id: savedUser._id }, JWT_SECRET);
            const { _id, name, email, followers, following, image } = savedUser;
            res.json({
              token,
              user: { _id, name, email, image, followers, following },
            });
          } else {
            return res.status(422).json({ error: "Invalid Email o Password" });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
