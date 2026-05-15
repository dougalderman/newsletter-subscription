/* DROP DATABASE IF EXISTS SUBSCRIPTIONS;
CREATE DATABASE SUBSCRIPTIONS;
USE SUBSCRIPTIONS; */

-- EmailVerifications table

DROP TABLE IF EXISTS EmailVerifications;
CREATE TABLE EmailVerifications (
  id serial PRIMARY KEY,
  email text NOT NULL,
  verification_code text,
  expires_at timestamp NOT NULL
); 

 -- Users table

DROP TABLE IF EXISTS Users;
CREATE TABLE Users (
  id serial PRIMARY KEY,
  first_name text NOT NULL,
  last_name text,
  email_id int REFERENCES EmailVerifications,
  password_hash text NOT NULL,
  phone_number text,
  street_address text,
  county text NOT NULL,
  `state` text,
  zip_code text,
  subscriber boolean NOT NULL, 
  subscription_level int NOT NULL,
  verified boolean NOT NULL,
  created_at timestamp NOT NULL,
  admin_authorized boolean NOT NULL
);