DROP DATABASE IF EXISTS highscores;
CREATE DATABASE highscores;
\c highscores;
CREATE TABLE DATABASE_URL (ID SERIAL PRIMARY KEY,player VARCHAR,score INTEGER);
INSERT INTO DATABASE_URL (player, score)
  VALUES ('Tyler', 4);
INSERT INTO DATABASE_URL (player, score)
  VALUES ('Bill', 4);
INSERT INTO DATABASE_URL (player, score)
  VALUES ('Phillip', 0);