-- migrate:up
CREATE EXTENSION if NOT EXISTS "uuid-ossp";

CREATE EXTENSION if NOT EXISTS "hstore";

CREATE EXTENSION if NOT EXISTS "vector";

CREATE EXTENSION if NOT EXISTS "lo";

CREATE TABLE IF NOT EXISTS todo (
  id serial PRIMARY KEY,
  task TEXT,
  done BOOLEAN DEFAULT FALSE
);

INSERT INTO
  todo (task, done)
VALUES
  ('Install PGlite from NPM', TRUE);

INSERT INTO
  todo (task, done)
VALUES
  ('Load PGlite', TRUE);

INSERT INTO
  todo (task, done)
VALUES
  ('Create a table', TRUE);

INSERT INTO
  todo (task, done)
VALUES
  ('Insert some data', TRUE);

INSERT INTO
  todo (task)
VALUES
  ('Update a task');
