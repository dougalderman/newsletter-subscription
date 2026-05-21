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
  }
}

export class UsersController {

  static createUser(mySqlPool: Pool): any {

    let passwordHash: string = '';

    return (req: any, res: any, next: any) => {
      console.log('Request body create user: ', req.body);

      if (req.body) {
        if (req.body.password) {
          bcrypt.hash(req.body.password, Number(process.env.SALT_ROUNDS), async function(err, hash) {
            if (err) {
              console.error('Error hashing password: ', err);
              return res.status(500).send('Error hashing password');
            }
            else {
              passwordHash = hash;
              console.log('Password hash: ', passwordHash);

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
              );

              try {

                console.log('Before parsing user: ', user);
                const parsedUser = UserSchema.parse(user);
                console.log('After parsing user', parsedUser);
                
                const sql = 'INSERT INTO Users (first_name, last_name, email, password_hash, phone_number, ' +
                    'street_address1, street_address2, city, county, state, zip_code, subscriber, subscription_level, verified, ' +
                    'created_at, admin_authorized) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, FALSE, NOW(), FALSE)';
                
                const values: any[] = [
                    parsedUser.firstName,
                    parsedUser.lastName,
                    parsedUser.email,
                    parsedUser.passwordHash,
                    parsedUser.phoneNumber,
                    parsedUser.streetAddress1,
                    parsedUser.streetAddress2, 
                    parsedUser.city,
                    parsedUser.county,
                    parsedUser.state,
                    parsedUser.zipCode,
                    parsedUser.subscriber,
                    parsedUser.subscriptionLevel,
                  ]

                  try {
                    const [results, fields] = await mySqlPool.execute(sql, values);

                    console.log('results: ', results);
                    console.log('fields: ', fields);

                    next();
                  }  
                  catch(err) {
                    console.error('error executing SQL: ', err);
                    return res.status(500).send(err);
                  }
              }
              catch(err) {
                if (err instanceof z.ZodError) {
                  console.error('Validation error: ', err.issues);  
                  return res.status(400).send(err.issues);
                }
                else {
                  console.error('Unknown error: ', err);
                  return res.status(500).send('Unknown error');
                }          
              }
            }  
          });  
        }
        else {
          console.error('Password is required');
          return res.status(400).json({
            error: 'password is required',
            receivedKeys: Object.keys(req.body ?? {}),
          });
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
          console.error('error executing SQL: ', err);
          return res.status(500).send(err);
        }
      }
      else {
        console.error('email is required');
        return res.status(400).json({
          error: 'email is required',
          receivedKeys: Object.keys(req.body ?? {}),
        });
      }
    }
  }

  static setUserVerified(mySqlPool: Pool): any {
      
    return async (req: any, res: any, next: any) => {
      console.log('Request body setUserVerified: ', req.body);
      if (req.body && req.body.email) {
        console.log('req.body && req.body.email');

        const sql = 'UPDATE Users SET verified=true WHERE email = ?';
        const values = [req.body.email];

        try {
          const [results, fields] = await mySqlPool.execute(sql, values);

          console.log('results: ', results);
          console.log('fields: ', fields);

          const resultsArray: any = Array.isArray(results) ? results : [];

          if (resultsArray[0].affectedRows > 0) { // if successful update
            return res.send({ message: 'User record updated' });
          }
          else {
            return res.status(500).send('Problem updating user record');
          }  
        }
        catch(err) {
          console.error('error executing SQL: ', err);
          return res.status(500).send(err);
        }
      }
      else {
        console.error('email is required');
        return res.status(400).json({
          error: 'email is required',
          receivedKeys: Object.keys(req.body ?? {}),
        });
      }
    }
  }
}

