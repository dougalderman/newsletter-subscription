import type { EmailVerificationType } from '../../schemas/emailVerifications.schema'; 
import { EmailVerificationSchema } from '../../schemas/emailVerifications.schema';
import type { Pool } from 'mysql2/promise';
import bcrypt from 'bcrypt';
import * as z from 'zod';

class EmailVerification implements EmailVerificationType {
  email: string;
  
  constructor(
    email: string
  ) {
    this.email = email;
  }
}

export class EmailVerificationsController {

  static createEmailVerification(mySqlPool: Pool): any {

    let otpHash: string = '';
  
    return (req: any, res: any, next: any) => {
      console.log('Request body creating email verification: ', req.body);
      
      if (req.body && req.body.email) {
        console.log('req.body.email: ', req.body.email);

        const emailVerification = new EmailVerification(
          req.body.email
        );
  
        const otp: string = generateOtp();
        console.log('Generated OTP: ', otp);
  
        function generateOtp(): string {
          // Generate a random number between 0 and 999999
          const num = Math.floor(Math.random() * 1000000);
          
          // Convert the number to a string and pad with leading zeros if necessary
          return num.toString().padStart(6, '0');
        }
  
        bcrypt.hash(otp, Number(process.env.SALT_ROUNDS), async function(err, hash) {
          if (err) {
            console.log('Error hashing OTP: ', err);
            return res.status(500).send('Error hashing OTP');
          }
          else {
            otpHash = hash;
            console.log('OTP hash: ', otpHash);
            console.log('OTP hash length: ', otpHash.length);

            try {

              EmailVerificationSchema.parse(emailVerification);
              
              const sql = 'INSERT INTO EmailVerifications (email, verification_code_hash, expires_at) ' +
                  'VALUES(?, ?, DATE_ADD(NOW(), INTERVAL 10 MINUTE))';
              
              const values = [
                  emailVerification.email,
                  otpHash
                ]
        
                try {
                  const [results, fields] = await mySqlPool.execute(sql, values);
        
                  console.log('results: ', results);
                  console.log('fields: ', fields);
                  
                  req.otp = otp;  
                  next();
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
        });
      }
    }
  }      
  
  static verifyEmail(mySqlPool: Pool): any {
    
    let userSubmittedOtpHash: string = '';
    let storedOtpHash: string = '';

    return async (req: any, res: any) => {
      console.log('Request body verify email: ', req.body);

      if (req.body && req.body.email && req.body.otp) {
        const sql = 'SELECT verification_code_hashed FROM EmailVerifications WHERE email = ?';
        
        const values = [
            req.body.email
          ]
  
          try {
            const [results, fields] = await mySqlPool.execute(sql, values);
  
            console.log('results: ', results);
            console.log('fields: ', fields);
  
            if (Array.isArray(results) && results.length > 0) {
              storedOtpHash = String(results[0]);

              bcrypt.hash(req.body.otp, Number(process.env.SALT_ROUNDS), function(err, hash) {
                if (err) {
                  console.log('Error hashing OTP ', err);
                  return res.status(500).send('Error hashing OTP');
                }
                else {
                  userSubmittedOtpHash = hash;
                  if (userSubmittedOtpHash === storedOtpHash) {
                    return res.send({ message: 'OTP verified' });
                  } 
                }  
              });    
            }
            else {
              return res.status(400).send({ message: 'No OTP found for this email' });
            }
          }   
          catch(err) {
            return res.status(500).send(err);
          }    
      }
    }
  }    
}   