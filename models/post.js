const bookshelf = require("../data/connection");
const Comment = require("../models/comment");
const User = require("../models/user");

const Post = bookshelf.Model.extend({
  tableName: "post",
  user: function() {
    return this.belongsTo("User", "userId", "userId");
  },
  comments: function() {
    return this.hasMany("Comment", "postId", "postId");
  }
});

module.exports = bookshelf.model("Post", Post);
