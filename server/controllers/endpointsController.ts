// import { UsersController } from './usersController';
import type { Pool } from 'mysql2/promise';
import type { Transporter } from 'nodemailer';
import { UsersController } from './usersController';
import { EmailVerificationsController } from './emailVerificationsController';
import { SendEmailController } from './sendEmailController';
// import { AuthenticationController } from './authenticationController';

export class EndpointsController {

  constructor(app: any, mySqlPool: Pool, transporter: Transporter<any>) {
    this.runEndpoints(app, mySqlPool, transporter)
  }

  runEndpoints(app: any, mySqlPool: Pool, transporter: Transporter<any>) {

  // Endpoints

  // Checks that email is unique. If so, create a user record and an email verfication table record, and send an email to the user with the verification code.
  app.post('/api/signup', UsersController.checkEmailUniqueness(mySqlPool), UsersController.createUser(mySqlPool), 
    EmailVerificationsController.createEmailVerification(mySqlPool), SendEmailController.sendEmail(transporter)); 
  // Confirms verification code and updates user record to indicate verified.
  app.post('/api/verify-email', EmailVerificationsController.verifyEmail(mySqlPool), UsersController.setUserVerified(mySqlPool));
  } 
}
