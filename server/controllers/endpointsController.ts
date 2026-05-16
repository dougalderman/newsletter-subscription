// import { UsersController } from './usersController';
import type { Pool } from 'mysql2/promise';
import type { Transporter } from 'nodemailer';
import { UsersController } from './usersController';
import { AuthenticationController } from './authenticationController';

export class EndpointsController {
  constructor(app: any, mySqlPool: Pool, transporter: Transporter<any>) {
    this.runEndpoints(app, mySqlPool, transporter)
  }

  runEndpoints(app: any, mySqlPool: Pool, transporter: Transporter<any>) {

  // Endpoints

  // Users
  app.get('/api/analytics', AuthenticationController.authenticateToken, UsersController.readAll(mySqlPool)); // Gets analytics data for admin dashboard.
  app.post('/api/signup', UsersController.create(mySqlPool)); // Signs up new subscriber.
  app.post('/api/verify-email', UsersController.verifyEmail(mySqlPool)); // Confirms verification code and writes user record to database.
  app.post('/api/login', UsersController.login(mySqlPool), AuthenticationController.signToken); // Logs in user.

  // Routes

  // 200 catch for /signup
  /* app.get('/signup', (req: any, res: any) => {
    res.status(200).sendFile('index.html', {root: path});
  });
  
  // 200 catch for /email-verification
  app.get('/email-verification', (req: any, res: any) => {
    res.status(200).sendFile('index.html', {root: path});
  });

  // 200 catch for /email-verification
  app.get('/email-verification', (req: any, res: any) => {
    res.status(200).sendFile('index.html', {root: path});
  });

  // 404 catch
  app.all('/{*splat}', (req: any, res: any) => {
    res.status(404).send('Not Found');
  }); */
  } 
}
