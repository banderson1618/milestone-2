DROP DATABASE IF EXISTS highscores;
CREATE DATABASE highscores;
\c highscores;
CREATE TABLE highscores (ID SERIAL PRIMARY KEY,player VARCHAR,score INTEGER);
INSERT INTO highscores (player, score)
  VALUES ('Tyler', 4);
INSERT INTO highscores (player, score)
  VALUES ('Bill', 4);
INSERT INTO highscores (player, score)
  VALUES ('Phillip', 0);