import type { EmailVerificationBackEndType } from '../../schemas/emailVerification.schema'; 
import { EmailVerificationBackEndSchema } from '../../schemas/emailVerification.schema';
import type { Pool } from 'mysql2/promise';
import bcrypt from 'bcrypt';
import * as z from 'zod';

class EmailVerification implements EmailVerificationBackEndType {
  email: string;
  otpHash: string;
  
  constructor(
    email: string,
    otpHash: string
  ) {
    this.email = email;
    this.otpHash = otpHash;
  }
}

function generateOtp(): string {
  // Generate a random number between 0 and 999999
  const num = Math.floor(Math.random() * 1000000);
  
  // Convert the number to a string and pad with leading zeros if necessary
  return num.toString().padStart(6, '0');
}
  
export class EmailVerificationsController {

  static createEmailVerification(mySqlPool: Pool): any {

    let otpHash: string = '';
  
    return (req: any, res: any, next: any) => {
      console.log('Request body creating email verification: ', req.body);
      
      if (req.body && req.body.email) {
        console.log('req.body.email: ', req.body.email);

        const otp: string = generateOtp();
        console.log('Generated OTP: ', otp);
  
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
              const emailVerification = new EmailVerification(
                req.body.email,
                otpHash
              );

              EmailVerificationBackEndSchema.parse(emailVerification);
              
              const sql = 'INSERT INTO EmailVerifications (email, verification_code_hash, expires_at) ' +
                  'VALUES(?, ?, DATE_ADD(NOW(), INTERVAL 10 MINUTE))';
              
              const values = [
                  emailVerification.email,
                  emailVerification.otpHash
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
    
    let storedOtpHash: string = '';
    let expiresAt: Date;

    return async (req: any, res: any, next:any) => {
      console.log('Request body verify email: ', req.body);

      if (req.body && req.body.email && req.body.otp) {
        const sql = 'SELECT verification_code_hash, expires_at FROM EmailVerifications WHERE email = ?';
        
        const values = [
            req.body.email
          ]
  
          try {
            const [results, fields] = await mySqlPool.execute(sql, values);
  
            console.log('results: ', results);
            console.log('fields: ', fields);
  
            if (Array.isArray(results) && results.length > 0) {
              const resultsObj: any = results[0];
              storedOtpHash = String(resultsObj.verification_code_hash);
              expiresAt = new Date(resultsObj.expires_at);

              if (new Date() >= expiresAt) {
                return res.status(400).send({message: 'OTP is expired'});
              }

              bcrypt.compare(req.body.otp, storedOtpHash, (err, result) => {
                if (err) {
                  console.log('Error verifyingg OTP', err);
                  return res.status(500).send('Error verifying OTP');
                }
                else {
                  console.log('result: ', result);
                  if (result) {
                    console.log('OTP verified');
                    next();
                  }
                  else {
                    return res.status(400).send('Submitted OTP is invalid');
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