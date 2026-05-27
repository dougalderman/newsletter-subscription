# React Newsletter Subscription

A newsletter subscription form for U.S.-based subscribers, with different subscription levels and email verification, and an analytics page. It uses React v19, Node.js v24, and MySQL v8.

## Requirements

The signup form has fields for first name, last name, email, password, confirm password, phone number, street address1, street address2, state, county, zip code, and a selection of different subscription levels. Here are the levels:

1)	Free
2)	$5/month
3)	$10/month
4)	$15/month
5)	$20/month
6)	$25/month
7)	$50 month (max)

![Signup form](readme_images/Sign_Up_Form.jpg)

Phone number and street address2 aren’t required. Hitting the submit button on this page triggers the server to make sure the email is not already in database. If the email is unique, the user record is added to the database with the verified field set to false. There is an email verification involving sending a verification code. 

![Email verification form](readme_images/Email_Verification_Form.jpg)

After email is verified by being entered in a form, the screen displays a message saying that the user has been successfully added as a subscriber (ignoring payments). The verified field is set to true.

![Email verification form success message](readme_images/Email_Verification_Successful.jpg)

This is a React/Typerscript app with Axios/TanStack Query for http calls, Zod for back and front end schema, React Hook Form and Shadcn/UI for the signup and email verification forms, React Router/Vite for package builder, Node/Express for server, Nodemailer for sending emails, bcrypt for encrypting OTP codes, and a MySQL database to store the form information. There are two routes: signup & email-verification. Signup is the default route.

Technologies used:
React, TypeScript, Lodash, Axios, TanStack Query, Zod/React Hook Form, React Router/Vite, Shadcn/UI,  Node.js, Express, MySQL.

AI's used in development:
Cursor, Copilot, Google AI

