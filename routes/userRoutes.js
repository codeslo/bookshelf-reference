const express = require("express");
const router = express.Router();
const User = require("../models/user");

// ADD USER
router.post("/addUser", async (req, res, next) => {
  const { firstName, lastName } = req.body;
  try {
    await User.forge({
      userFirstName: firstName,
      userLastName: lastName
    }).save();
    res.status(200).json({ UserCreated: true });
  } catch (err) {
    console.log("addUser error: ", err);
    res.status(200).json({ UserCreated: false });
  }
});

//GET USER BY NAME
router.get("/getUser", async (req, res, next) => {
  // destructure from req.body
  const { firstName, lastName } = req.body;
  new User({ userFirstName: firstName, userLastName: lastName })
    .fetch()
    .then(user => res.status(200).json({ user: user }))
    .catch(err => console.log("getUser error: ", err));
});

// GET ALL USERS
router.get("/getAllUsers", async (req, res, next) => {
  User.fetchAll().then(users => {
    res.status(200).json({ users: users });
  });
});

module.exports = router;
