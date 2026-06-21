import type { Pool } from 'mysql2/promise';
import bcrypt from 'bcrypt';

export class LoginController {

  static loginUser(mySqlPool: Pool): any {

    let storedPasswordHash: string = '';
    let adminAuthorized: boolean = false;
  
    return async (req: any, res: any, next: any) => {
      
      if (req.body && req.body.email && req.body.password) {

        const sql = 'SELECT email, password_hash, admin_authorized FROM Users WHERE email = ?';
        
        const values = [
            req.body.email
          ]
  
          try {
            const [results] = await mySqlPool.execute(sql, values);
  
            if (Array.isArray(results) && results.length > 0) {
              const resultsObj: any = results[0];
              storedPasswordHash = String(resultsObj.password_hash);
              adminAuthorized = Boolean(resultsObj.admin_authorized);

              bcrypt.compare(req.body.password, storedPasswordHash, (err, result) => {
                if (err) {
                  console.error('Error verifying password', err);
                  return res.status(500).send('Error verifying password');
                }
                else {
                  if (result) {
                    req.user = { email: resultsObj.email, adminAuthorized: adminAuthorized };
                    next();
                  }
                  else {
                    return res.status(400).send('Invalid email or password');
                  }
                }
              });
            }
            else {
              return res.status(400).send({ message: 'Invalid email or password' });
            }
          }
          catch(err) {
            console.error('err: ', err);
            return res.status(500).send('Error verifying email');
          }
      }
      else {
        console.error('Email or Password not received in request body');
        return res.status(400).send('Error processing form');
      }    
    }
  }
}


             