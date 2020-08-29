const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const requiredLogin = require("../middleware/requiredLogin");
const Post = mongoose.model("Post");

const user = mongoose.model("User");

router.get("/user/:id", requiredLogin, (req, res) => {
  user
    .findOne({ _id: req.params.id })
    .select("-password")
    .then((user) => {
      Post.find({ postedBy: req.params.id })
        .populate("postedBy", "_id name")
        .exec((err, posts) => {
          if (err) {
            return res.status(422).json({ error: err });
          }
          res.json({ user, posts });
        });
    })
    .catch((err) => {
      return res.status(404).json({ error: "user not found" });
    });
});

router.put("/follow", requiredLogin, (req, res) => {
  user.findByIdAndUpdate(
    req.body.followId,
    {
      $addToSet: { followers: req.user._id },
    },
    {
      new: true,
    },
    (err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      }
    }
  );
  user
    .findByIdAndUpdate(
      req.user._id,
      {
        $addToSet: { following: req.body.followId },
      },
      {
        new: true,
      }
    )
    .select("-password")
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      // console.log(err);
      return res.status(422).json({ error: err });
    });
});

router.put("/unfollow", requiredLogin, (req, res) => {
  user.findByIdAndUpdate(
    req.body.unfollowId,
    {
      $pull: { followers: req.user._id },
    },
    {
      new: true,
    },
    (err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      }
      user
        .findByIdAndUpdate(
          req.user._id,
          {
            $pull: { following: req.body.unfollowId },
          },
          {
            new: true,
          }
        )
        .select("-password")
        .then((result) => {
          res.json(result);
        })
        .catch((err) => {
          //console.log(err);
          return res.status(422).json({ error: err });
        });
    }
  );
});

router.put("/updateimage", requiredLogin, (req, res) => {
  user.findByIdAndUpdate(
    req.user._id,
    {
      $set: { image: req.body.image },
    },
    { new: true },
    (err, result) => {
      if (err) {
        return res.status(422).json({ error: "image can't post" });
      }
      res.json(result);
    }
  );
});

module.exports = router;
