DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS loggedIn;
DROP TABLE IF EXISTS WallOfText;

CREATE TABLE users(
  email varchar(40) NOT NULL,
  password varchar(12) NOT NULL,
  fname varchar(40) NOT NULL,
  familyname varchar(40) NOT NULL,
  gender varchar(7) NOT NULL,
  city varchar(40) NOT NULL,
  country varchar(40) NOT NULL,

  PRIMARY KEY(email)
);

CREATE TABLE loggedIn(
  email varchar(40) NOT NULL,
  token varchar(40) NOT NULL UNIQUE,

  PRIMARY KEY(email),
  FOREIGN KEY('email') REFERENCES users(email)
);

CREATE TABLE WallOfText(
  id integer primary key autoincrement,
  reciever varchar(40) NOT NULL,
  sender varchar(40) NOT NULL,
  message varchar(128) NOT NULL,

  FOREIGN KEY(reciever) REFERENCES users(email),
  FOREIGN KEY(sender) REFERENCES users(email)
);
