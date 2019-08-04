const bookshelf = require("../data/connection");
const User = require("../models/user");
const Post = require("../models/post");
const Comment = require("../models/comment");

module.exports = async function() {
  const userCount = await bookshelf.knex("user").count("userId as userCount");
  const postCount = await bookshelf.knex("post").count("postId as postCount");
  const commentCount = await bookshelf
    .knex("comment")
    .count("* as commentCount");
  return {
    userCount: userCount[0].userCount,
    postCount: postCount[0].postCount,
    commentCount: commentCount[0].commentCount
  };
};
