/* DROP DATABASE IF EXISTS SUBSCRIPTIONS;
CREATE DATABASE SUBSCRIPTIONS;
USE SUBSCRIPTIONS; */

 --Users table

DROP TABLE IF EXISTS Users;
CREATE TABLE Users (
  id serial PRIMARY KEY,
  first_name text NOT NULL,
  last_name text,
  email text NOT NULL,
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