// another utility method test
const bookshelf = require("../data/connection");
const Post = require("../models/post");

module.exports = async function() {
  // uses knex query. knex will always return an array
  return await bookshelf.knex("post").count("postId as cnt");
};
