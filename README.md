# React Newsletter Subscription

A newsletter subscription form for U.S.-based subscribers, with different subscription levels and email verification, and an analytics page.

## Requirements

The form will have fields for first name, last name, email, password,confirm password, phone number, street address1, street address2, county, state, zip code, and a selection of different subscription levels. Here are the levels:

1)	Free
2)	$5/month
3)	$10/month
4)	$15/month
5)	$20/month
6)	$25/month
7)	$50 month (max)

Phone number and street address2 aren’t required. Hitting the submit button on this page will trigger the server to make sure the email is not already in database. If the email is unique, the user record will be added to the database with the verified field set to false. There will be an email verification involving sending a verification code. After email is verified, the screen will display a message saying that the user has been successfully added as a subscriber (ignoring payments). The verified field will be set to true.

There will be a separate analytics page. It will show the following:
 
1)	Line charts showing number and amount of subscriptions vs. time.
2)	A histogram showing number of subscriptions at each level.
3)	A bubble map showing visually subscriptions per U.S. county.


This will be a React/Typerscript app with Axios/TanStack Query for http calls, Zod combined with React Hook form and Shadcn/UI for the signup form, React Router/Vite for package builder, Node/Express for sever, Nodemailer for the email verification, bcrypt for encrypting passwords and OTP codes, JWT for handling login authentication, and a MySQL database to store the form information to and perform queries for the analytics. The analytics will use Observable Plot that will interpret the data in CSV format from database queries. There will be 4 routes: signup, email-verification, admin, and login. The admin route will be restricted to authenticated users. If an unauthenticated user tries to access admin, he’ll be directed to the login route.

Technologies used:
React, TypeScript, Lodash, Axios, TanStack Query, Observable Plot, Zod/React Hook Form, React Router/Vite, Shadcn/UI, Cursor, Copilot, Google AI, Node.js, Express, MySQL

