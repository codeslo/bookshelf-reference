const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Post = require("../models/post");
const Comment = require("../models/comment");

router.post("/addPost", async (req, res) => {
  try {
    const { postTitle, postBody, authorFirstName, authorLastName } = req.body;
    User.forge({ userFirstName: authorFirstName, userLastName: authorLastName })
      .fetch()
      .then(user => {
        if (user) {
          Post.forge({
            userId: user.attributes.userId,
            postBody: postBody,
            postTitle: postTitle
          }).save();
          res.status(200).send("post saved");
        } else {
          res.status(200).send("no author by that name");
        }
      });
  } catch (err) {
    console.log("addPost error: ", err);
    res.status(500).send("whoops, error");
  }
});

router.get("/getPostsByAuthor", (req, res) => {
  const { authorFirstName, authorLastName } = req.body;
  new User({
    userFirstName: authorFirstName,
    userLastName: authorLastName
  })
    .fetch({ withRelated: ["posts"] })
    .then(posts => res.status(200).json({ data: posts }));
});

router.get("/getAllPosts", (req, res) => {
  Post.fetchAll().then(posts => {
    res.status(200).json({ posts: posts });
  });
});

router.get("/getPostWithComments", (req, res) => {
  const { postId } = req.body;
  new Post({ postId: postId })
    .fetch({ withRelated: ["comments", "user"] })
    .then(postUser => res.status(200).json({ post: postUser }));
});

router.get("/getPostWithAuthor", (req, res) => {
  const { postId } = req.body;
  new Post({ postId: postId })
    .fetch({ withRelated: ["user"] })
    .then(post => res.status(200).json({ post: post }));
});

router.put("/updatePost", (req, res) => {
  const { postId, postTitle, postBody } = req.body;
  new Post()
    .where({ postId: postId })
    .save({ postTitle: postTitle, postBody: postBody }, { patch: true })
    .then(post => {
      res.status(200).json({ postStatus: "updated", post: post });
    });
});

router.delete("/deletePost", (req, res) => {
  const { postId } = req.body;
  // first destroy all related comments to clear foreign key constraint
  new Comment().where({ postId: postId }).destroy();
  // then destroy post
  new Post()
    .where({ postId: postId })
    .destroy()
    .then(() => {
      res.status(200).json({ response: `post ${postId} deleted` });
    });
});

module.exports = router;
