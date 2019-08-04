const bookshelf = require("../data/connection");
const Post = require("../models/post");
const User = require("../models/user");

const Comment = bookshelf.Model.extend({
  tableName: "comment",
  post: function() {
    // each post belongs to one user
    return this.belongsTo("Post", "postId", "postId");
  },
  user: function() {
    // each comment belongs to one user
    return this.belongsTo("User", "userId", "userId");
  }
});

module.exports = bookshelf.model("Comment", Comment);
