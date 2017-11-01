CREATE TABLE users (
  id bigserial PRIMARY KEY,
  email varchar(255) NOT NULL UNIQUE, -- could be primary key
  name varchar(255) NOT NULL,
  first_name varchar(255) NOT NULL,
  last_name varchar(255) NOT NULL,
  server_auth_code varchar(255),
  access_token varchar(255)
);

CREATE TABLE user_tokens (
  user_id bigint NOT NULL,
  token varchar(255),
  PRIMARY KEY (user_id, token),
  CONSTRAINT fk_user_exists
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE organisations (
  id bigserial PRIMARY KEY,
  name varchar(50) NOT NULL,
  deadline timestamptz NOT NULL,
  party timestamptz NOT NULL,
  location varchar(255)
);

CREATE TABLE memberships (
  org_id bigint NOT NULL,
  user_id bigint NOT NULL,
  validity_date timestamptz NOT NULL,
  PRIMARY KEY (org_id, user_id),
  CONSTRAINT fk_organisation_exists
    FOREIGN KEY (org_id) REFERENCES organisations(id),
  CONSTRAINT fk_user_exists
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE secretsantas (
  santa_user_id bigint NOT NULL,
  kid_user_id bigint NOT NULL,
  org_id bigint NOT NULL,
  PRIMARY KEY (santa_user_id, kid_user_id, org_id),
  CONSTRAINT fk_organisation_exists
    FOREIGN KEY (org_id) REFERENCES organisations(id),
  CONSTRAINT fk_santa_exists
    FOREIGN KEY (santa_user_id) REFERENCES users(id),
  CONSTRAINT fk_kid_exists
    FOREIGN KEY (kid_user_id) REFERENCES users(id)
);

CREATE TABLE obsolete_organisations (
  id bigint PRIMARY KEY,
  name varchar(50) NOT NULL,
  deadline timestamptz NOT NULL,
  party timestamptz NOT NULL,
  location varchar(255)
);

CREATE TABLE obsolete_secretsantas (
  obs_org_id bigint PRIMARY KEY REFERENCES obsolete_organisations(id),
  santa_user_id bigint NOT NULL,
  kid_user_id bigint NOT NULL,
  validity_date timestamptz NOT NULL
);

-- To create tables from this locally do: psql <database> < createTablesScript.sql
-- or in psql cli do the following:
-- 1. \e to edit the buffer (vi should open)
-- 2. copy paste these create table (or any other) statements
-- 3. upon saving they are executed.