use bookshelf_test_db;
create table user(
userId int auto_increment primary key,
userFirstName varchar(50),
userLastName varchar(50)
);
create table post(
postId int auto_increment primary key,
userId int,
postTitle varchar(500),
postBody text,
foreign key(userId) references user(userId)
);

create table comment(
postId int,
userId int,
commentBody text,
primary key(postId,userId),
foreign key(postId) references post(postId),
foreign key(userId) references user(userId)
);