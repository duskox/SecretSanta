CREATE TABLE users (
  id bigserial PRIMARY KEY,
  email varchar(255) NOT NULL UNIQUE, -- could be primary key
  password varchar(255) NOT NULL, -- this shouls be encrypted
  name varchar(255) NOT NULL
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