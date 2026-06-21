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
      
      if (req.body && req.body.email) {

        const otp: string = generateOtp();
        console.log('otp: ', otp);
  
        bcrypt.hash(otp, Number(process.env.SALT_ROUNDS), async function(err, hash) {
          if (err) {
            console.error('Error hashing OTP: ', err);
            return res.status(500).send('Error generating verification code.');
          }
          else {
            otpHash = hash;
            
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
                  await mySqlPool.execute(sql, values);
        
                  req.otp = otp;  
                  next();
                }  
                catch(err) {
                  console.error('err: ', err);
                  return res.status(500).send('Database error');
                }
            }      
            catch(err) {
              if (err instanceof z.ZodError) {
                console.error('err.issues: ', err.issues);
                return res.status(400).send(err.issues);
              }
              else {
                return res.status(500).send('Unknown error');
              }          
            }
          }
        });
      }
      else {
        console.error('Email not received in request body');
        return res.status(400).send('Error processing form');
      }    
    }
  }      
  
  static verifyEmail(mySqlPool: Pool): any {
    
    let storedOtpHash: string = '';
    let expiresAt: Date;

    return async (req: any, res: any, next:any) => {

      if (req.body && req.body.email && req.body.otp) {
        const sql = 'SELECT verification_code_hash, expires_at FROM EmailVerifications WHERE email = ?';
        
        const values = [
            req.body.email
          ]
  
          try {
            const [results] = await mySqlPool.execute(sql, values);
  
            if (Array.isArray(results) && results.length > 0) {
              const resultsObj: any = results[0];
              storedOtpHash = String(resultsObj.verification_code_hash);
              expiresAt = new Date(resultsObj.expires_at);

              if (new Date() >= expiresAt) {
                return res.status(400).send({message: 'Verification code is expired'});
              }

              bcrypt.compare(req.body.otp, storedOtpHash, (err, result) => {
                if (err) {
                  console.error('Error verifying OTP', err);
                  return res.status(500).send('Error verifying code');
                }
                else {
                  if (result) {
                    next();
                  }
                  else {
                    return res.status(400).send('Verification code is invalid');
                  } 
                }  
              });    
            }
            else {
              return res.status(400).send({ message: 'No verification code found for this email' });
            }
          }   
          catch(err) {
            console.error('err: ', err);
            return res.status(500).send('Error verifying email');
          }    
      }
      else {
        console.error('Email or otp not received in request body');
        return res.status(400).send('Error processing form');
      }    
    }
  }    
}   