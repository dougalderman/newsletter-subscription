/* DROP DATABASE IF EXISTS SUBSCRIPTIONS;
CREATE DATABASE SUBSCRIPTIONS;
USE SUBSCRIPTIONS; */

-- EmailVerifications table

DROP TABLE IF EXISTS EmailVerifications;
CREATE TABLE EmailVerifications (
  id serial PRIMARY KEY,
  email varchar(255) NOT NULL UNIQUE,
  verification_code_hash varchar(255) NOT NULL,
  expires_at timestamp NOT NULL
); 

 -- Users table

DROP TABLE IF EXISTS Users;
CREATE TABLE Users (
  id serial PRIMARY KEY,
  first_name varchar(255) NOT NULL,
  last_name varchar(255) NOT NULL,
  email varchar(255) NOT NULL UNIQUE,
  password_hash varchar(255) NOT NULL,
  phone_number varchar(255),
  street_address1 varchar(255) NOT NULL,
  street_address2 varchar(255),
  city varchar(255) NOT NULL,
  county varchar(255) NOT NULL,
  `state` varchar(255) NOT NULL,
  zip_code varchar(255) NOT NULL,
  subscriber boolean NOT NULL, 
  subscription_level int NOT NULL,
  verified boolean NOT NULL,
  created_at timestamp NOT NULL,
  admin_authorized boolean NOT NULL
);