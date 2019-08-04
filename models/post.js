const bookshelf = require("../data/connection");
const Comment = require("../models/comment");
const User = require("../models/user");

const Post = bookshelf.Model.extend({
  tableName: "post",
  // each post belongs to one user
  user: function() {
    return this.belongsTo("User", "userId", "userId");
  },
  // each post can have many comments
  comments: function() {
    return this.hasMany("Comment", "postId", "postId");
  }
});

module.exports = bookshelf.model("Post", Post);
