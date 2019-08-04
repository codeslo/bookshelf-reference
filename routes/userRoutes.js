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
  const { firstName, lastName } = req.body;
  try {
    const userData = await User.where({
      userFirstName: firstName,
      userLastName: lastName
    }).fetch();
    if (userData) {
      res.status(200).json({ user: userData });
    } else {
      res.status(200).send("no user found");
    }
  } catch (err) {
    console.log("getUser error: ", err);
    res.status(500).send("whoops, server error");
  }
});

// GET ALL USERS
router.get("/getAllUsers", async (req, res, next) => {
  User.fetchAll().then(users => {
    res.status(200).json({ users: users });
  });
});

module.exports = router;
