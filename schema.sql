DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS loggedIn;
DROP TABLE IF EXISTS WallOfText;

CREATE TABLE if NOT EXISTS users(
    email VARCHAR(50),
    password VARCHAR(50),
    fname VARCHAR(50),
    familyname VARCHAR(50),
    gender VARCHAR(50),
    city VARCHAR(50),
    country VARCHAR(50),
    salt VARCHAR(50),
    PRIMARY KEY (email)
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
