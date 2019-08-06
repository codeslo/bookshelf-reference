## Bookshelf.js Reference

<br>
This is a sample application meant to be used as a reference for creating Bookshelf.js methods. I've used a minimal number of libraries to help isolate those necessary for using Bookshelf as an ORM.

Bookshelf.js and Knex.js are both modern JavaScript libraries so some knowledge of ES6 syntax (arrow functions, destucturing) is assumed in this reference.

#### Dependencies

Bookshelf.js depends on the Knex query builder. The Bookshelf plugin Registry is also necessary for avoiding circular references in models. MySQL is used for connecting to the database.

The pattern I used in this reference was to add all references to dependencies in a single file.
_/data/connection.js_

```javascript
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
```

The data connection is then simply imported as 'bookshelf' elsewhere in the application.

Note: The registry plugin is subtle. The only way to see it is in use other than in the connection file is that model files reference other model files as strings rather than variables.

_Example from models/post_

```javascript
const Post = bookshelf.Model.extend({
  tableName: "post",
  // each post belongs to one user.
  //Note that "User" is passed as a string. This is for the Registry plugin.
  user: function() {
    return this.belongsTo("User", "userId", "userId");
  },
  // each post can have many comments
  comments: function() {
    return this.hasMany("Comment", "postId", "postId");
  }
});
```

**TODO: Create seed data for database**

#### Other Modules

The only other modules in this application are Express (to create a web server) Body-Parser (for access to the request object) and Morgan (for logging requests.)

#### To Connect to your local database

Edit the connection details in **data/connection.js**

#### To Test the Endpoints

Use Postman (or similar) to query the endpoints. Parameters should be provided in the body as x-www-form-urlencoded data.

#### Bookshelf Basics

Bookshelf.js is an Object Relational Mapper that can make querying an application's database easier. Tables can be converted to Bookshelf models very quickly and relationships (one-to-many, one-to-one, etc) can be established in the models themselves, making joined queries easier to write and read.

#### Bookshelf and Knex

Since bookshelf is built on Knex, Knex queries can be written right into Bookshelf functions. However, this is not necessary for most common CRUD operations.
**Bookshelf queries return JavaScript Promises.**

#### More about Bookshelf and Knex

[Bookshelf API Reference]('https://bookshelfjs.org/api.html')
[Knex Tutorial]('https://bookshelfjs.org/api.html')
[Knex Cheatsheat]('https://devhints.io/knex')

#### Knex Model Examples

_/models/user_
_/models/post_
_/models/comment_

The methods on the models define relationships to other tables. **belongsTo** is a many-to-one. **hasMany** is a one-to-many. See the example below.

```JavaScript
const User = bookshelf.Model.extend({
  tableName: "user",
  // a user can have many posts
  posts: function() {
    return this.hasMany("Post", "userId", "userId");
  }
});
```

Bookshelf objects automatically have access to all the rows in their corresponding table ('tableName') and these rows can be accessed as properties via dot notaiton.

This also example shows the one-to-many relationship between a user and posts made by the user. This is basically a stored join. "Post" is the model that can be joined in a query, the first "userId" referers to the foreign key in posts and the second "userId" referes to the corresponding row in the foreign table.

This join can then be 'activated' with a 'withRelated' parameter in a bookshelf query. See below.
Note: Not all Bookshelf models have join methods. They are convenient but optional.

#### GET Routes

**SELECT row FROM table WHERE field = 'foo'**

_/routes/userRoutes/getUser_

```javascript
//GET USER BY NAME
router.get("/getUser", async (req, res, next) => {
  // destructure from req.body
  const { firstName, lastName } = req.body;
  new User({ userFirstName: firstName, userLastName: lastName })
    .fetch()
    .then(user => res.status(200).json({ user: user }))
    .catch(err => console.log("getUser error: ", err));
});
```

This example shows a common pattern for Bookshelf. First, the necessary parameters for the query are destructured from the req.body object. Then, an instance of a model (User) is created,and passed the query parameters. Next, the fetch method is called, which returns a promise. Finally, a then method returns the data as JSON and a catch is added in case of an error.

**SELECT \* FROM table**
_/routes/userRoutes/getAllUsers_

**SELECT row1, row2 FROM table INNER JOIN on field**
_/routes/postRoutes/getPostsByAuthor_

```javascript
router.get("/getPostWithAuthor", (req, res) => {
  const { postId } = req.body;
  new Post({ postId: postId })
    .fetch({ withRelated: ["user"] })
    .then(post => res.status(200).json({ post: post }));
});
```

Here we can see how the **withRelated** parameter is passed to the model. Note: for this to work, the model must have a method (called 'user' in this case) that defines the relationship.

**Multiple joins**
_routes/postRoutes/getPostWithComments_

\*\*Note: To understand joins in Bookshelf it is important to look at both the route and the models in question.

Basically, multiple joins are created simply by passing multiple defined relationships back to the model. This query works because Post has a defined relationship with both the User and Comment models.

```javascript
router.get("/getPostWithComments", (req, res) => {
  const { postId } = req.body;
  new Post({ postId: postId })
    .fetch({ withRelated: ["comments", "user"] })
    .then(postUser => res.status(200).json({ post: postUser }));
});
```

#### POST Routes

**INSERT into table**
_/routes/userRoutes/addUser_
_/routes/postRoutes/addPost_
_/routes/commentRoutes/addComment_

#### UPDATE Routes

_/routes/postRoutes/updatePost_
\*\*Note: both the where clause and the 'patch' object are necessary for updating existing data.

```javascript
router.put("/updatePost", (req, res) => {
  const { postId, postTitle, postBody } = req.body;
  new Post()
    .where({ postId: postId })
    .save({ postTitle: postTitle, postBody: postBody }, { patch: true })
    .then(post => {
      res.status(200).json({ postStatus: "updated", post: post });
    });
});
```

#### DELETE Routes

_/routes/postRoutes/deletePost_

\*\*Note: In this example, posts have a foreign key relationship with comments and so can't be deleted in one step. First, all comments associated with the post must be deleted, and then the post is deleted.

```javascript
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
```

#### Routes that rely on helper functions

_/routes/postRoutes/getStats_
\*/utilityMethods/getStats

The getStats endpoint gets a count of all rows in all tables. This data is provided by the utilityMethods/getStats.js function. The best way to utilize helper methods that access the database is with an async function. Async functions always return a promise, which keeps usage consistent with the way Bookshelf and Knex work.

\*getStats.js\*\*

```javascript
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
```

_/routes/postRoutes/getStats_

```javascript
router.get("/getStats", async (req, res) => {
  getStats().then(stats => res.status(200).json({ stats: stats }));
});
```
