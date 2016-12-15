DROP DATABASE IF EXISTS highscores;
CREATE DATABASE highscores;

\c highscores;

CREATE TABLE highscores (
  ID SERIAL PRIMARY KEY,
  user VARCHAR,
  score INTEGER
);

INSERT INTO highscores (user, score)
  VALUES ('Tyler', 1);

INSERT INTO highscores (user, score)
  VALUES ('Bill', 1);

INSERT INTO highscores (user, score)
  VALUES ('Phillip', 2);