import type { UserType } from '../../schemas/user.schema';
import { UserSchema } from '../../schemas/user.schema';
import type { Pool } from 'mysql2/promise';
import bcrypt from 'bcrypt';
import * as z from 'zod';

class User implements UserType {
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string;
  phoneNumber: string;
  streetAddress1: string;
  streetAddress2: string;
  city: string;
  county: string;
  state: string;
  zipCode: string;
  subscriber: boolean;
  subscriptionLevel: number;
  verified: boolean;
  adminAuthorized: boolean;

  constructor(
    firstName: string,
    lastName: string,
    email: string,
    passwordHash: string,
    phoneNumber: string,
    streetAddress1: string,
    streetAddress2: string,
    city: string,
    county: string,
    state: string,
    zipCode: string,
    subscriber: boolean,
    subscriptionLevel: number,
    verified: boolean,
    adminAuthorized: boolean
  ) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.passwordHash = passwordHash;
    this.phoneNumber = phoneNumber;
    this.streetAddress1 = streetAddress1;
    this.streetAddress2 = streetAddress2;
    this.city = city;
    this.county = county;
    this.state = state;
    this.zipCode = zipCode;
    this.subscriber = subscriber;
    this.subscriptionLevel = subscriptionLevel;
    this.verified = verified;
    this.adminAuthorized = adminAuthorized; 
  }
}

export class UsersController {

  static createUser(mySqlPool: Pool): any {

    let passwordHash: string = '';

    return async (req: any, res: any) => {
      if (req.body) {
        if (req.body.password) {
          bcrypt.hash(req.body.password, Number(process.env.SALT_ROUNDS), function(err, hash) {
            if (err) {
              console.log('Error hashing password: ', err);
              return res.status(500).send('Error hashing password');
            }
            else {
              passwordHash = hash;
            }  
          });    
        }
      }  

      const user = new User(
        req.body.firstName,
        req.body.lastName,
        req.body.email,
        passwordHash,
        req.body.phoneNumber,
        req.body.streetAddress1,
        req.body.streetAddress2,
        req.body.city,
        req.body.county,
        req.body.state,
        req.body.zipCode,
        req.body.subscriber,
        req.body.subscriptionLevel,
        true,
        false
      );

      try {

        UserSchema.parse(user);
        
        const sql = 'INSERT INTO Users (first_name, last_name, email, password_hash, phone_number, ' +
            'street_address, county, state, zip_code, subscriber, subscription_level, verified, ' +
            'created_at, admin_authorized) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?)';
        
        const values = [
            user.firstName,
            user.lastName,
            user.email,
            user.passwordHash,
            user.phoneNumber,
            user.streetAddress1,
            user.streetAddress2, 
            user.county,
            user.state,
            user.zipCode,
            user.subscriber,
            user.subscriptionLevel,
            user.verified,
            user.adminAuthorized
          ]

          try {
            const [results, fields] = await mySqlPool.execute(sql, values);

            console.log('results: ', results);
            console.log('fields: ', fields);

            return res.send(results);
          }  
          catch(err) {
            return res.status(500).send(err);
          }
      }
      catch(err) {
        if (err instanceof z.ZodError) {
          return res.status(400).send(err.issues);
        }
        else {
          return res.status(500).send('Unknown error');
        }          
      }
    }  
  }

  static checkEmailUniqueness(mySqlPool: Pool): any {
    
    return async (req: any, res: any, next: any) => {
      console.log('Request body check email uniqueness: ', req.body);
      if (req.body && req.body.email) {
        console.log('req.body && req.body.email');

        const sql = 'SELECT * FROM Users WHERE email = ?';
        const values = [req.body.email];

        try {
          const [results, fields] = await mySqlPool.execute(sql, values);

          console.log('results: ', results);
          console.log('fields: ', fields);

          if (Array.isArray(results) && results.length === 0) { // if email is unique
            next();
          }
          else {
            return res.status(409).send('Email already exists');
          }  
        }
        catch(err) {
          return res.status(500).send(err);
        }
      }
    }
  }
}

