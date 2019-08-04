const options = {
  client: "mysql",
  connection: {
    host: "localhost",
    user: "matt",
    password: "lame_password",
    database: "bookshelf_test_db"
  }
};

const knex = require("knex")(options);
const bookshelf = require("bookshelf")(knex);
bookshelf.plugin("registry");

module.exports = bookshelf;
