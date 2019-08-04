const express = require("express");
const router = express.Router();
const Comment = require("../models/comment");

router.post("/addComment", (req, res) => {
  const { postId, userId, commentBody } = req.body;
  Comment.forge({ postId: postId, userId: userId, commentBody: commentBody })
    .save()
    .then(comment => {
      res.status(200).json({ result: "comment saved" });
    })
    .catch(err => {
      console.log("addComment error: ", err);
      res.status(500).json({ error: true });
    });
});

router.get("/getUserComments", (req, res) => {
  const { userId } = req.body;
  new Comment({ userId: userId })
    .fetch({ withRelated: ["user"] })
    .then(comments => {
      res.status(200).json({ comments: comments });
    });
});

module.exports = router;
