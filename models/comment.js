const bookshelf = require("../data/connection");
const Post = require("../models/post");

const Comment = bookshelf.Model.extend({
  tableName: "comment",
  post: function() {
    return this.belongsTo("Post", "postId", "postId");
  }
});

module.exports = bookshelf.model("Comment", Comment);
