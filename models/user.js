const bookshelf = require("../data/connection");
const Post = require("../models/post");

const User = bookshelf.Model.extend({
  tableName: "user",
  // a user can have many posts
  posts: function() {
    return this.hasMany("Post", "userId", "userId");
  }
});

module.exports = bookshelf.model("User", User);
