// getPostData returns all data on a post, user, and comments
const bookshelf = require("../data/connection");
const User = require("../models/user");
const Post = require("../models/post");
const Comment = require("../models/comment");

module.exports = async function(postId) {
  return await new Post({ postId: postId }).fetch({
    withRelated: ["user", "comments"]
  });
};
