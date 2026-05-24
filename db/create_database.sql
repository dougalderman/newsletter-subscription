/* DROP DATABASE IF EXISTS SUBSCRIPTIONS;
CREATE DATABASE SUBSCRIPTIONS;
USE SUBSCRIPTIONS; */

-- EmailVerifications table

DROP TABLE IF EXISTS EmailVerifications;
CREATE TABLE EmailVerifications (
  id serial PRIMARY KEY,
  email varchar(255) NOT NULL UNIQUE CHECK (email <> ''),
  verification_code_hash varchar(255) NOT NULL CHECK (verification_code_hash <> ''),
  expires_at timestamp NOT NULL
); 

 -- Users table

DROP TABLE IF EXISTS Users;
CREATE TABLE Users (
  id serial PRIMARY KEY,
  first_name varchar(255) NOT NULL CHECK (first_name <> ''),
  last_name varchar(255) NOT NULL CHECK (last_name <> ''),
  email varchar(255) NOT NULL UNIQUE CHECK (email <> ''),
  password_hash varchar(255) NOT NULL CHECK (password_hash <> ''),
  phone_number varchar(255),
  street_address1 varchar(255) NOT NULL CHECK (street_address1 <> ''),
  street_address2 varchar(255),
  city varchar(255) NOT NULL CHECK (city <> ''),
  county varchar(255) NOT NULL CHECK (county <> ''),
  `state` varchar(255) NOT NULL CHECK (`state` <> ''),
  zip_code varchar(255) NOT NULL CHECK (zip_code <> ''),
  subscriber boolean NOT NULL, 
  subscription_level int NOT NULL,
  verified boolean NOT NULL,
  created_at timestamp NOT NULL,
  admin_authorized boolean NOT NULL
);