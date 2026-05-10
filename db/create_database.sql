/* DROP DATABASE IF EXISTS SUBSCRIPTIONS;
CREATE DATABASE SUBSCRIPTIONS;
USE SUBSCRIPTIONS; */

 --Users table

DROP TABLE IF EXISTS Users;
CREATE TABLE Users (
  id serial PRIMARY KEY,
  first_name text,
  last_name text,
  email text,
  password_hash text,
  phone_number text,
  street_address text,
  county text,
  `state` text,
  zip_code text,
  subscriber boolean, 
  subscription_level int,
  verified boolean,
  created_at timestamp,
  admin_authorized boolean
);