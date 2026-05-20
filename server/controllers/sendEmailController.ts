import { createTransport } from 'nodemailer';
import type { Transporter } from 'nodemailer';
import * as SMTPTransport from 'nodemailer/lib/smtp-transport';

export class SendEmail {
  smtpHost = process.env.SMTP_HOST;
  smtpPort = Number(process.env.SMTP_PORT);
  smtpSecure = Boolean(process.env.SMTP_SECURE);
  smtpUsername = process.env.SMTP_USERNAME;
  smtpPassword = process.env.SMTP_PASSWORD;

  options: SMTPTransport.Options = {
    host: this.smtpHost,
    port: this.smtpPort,
    secure: this.smtpSecure,
    auth: {
      user: this.smtpUsername,
      pass: this.smtpPassword
    },
    // logger: true
  }

  transporter: Transporter<SMTPTransport.SentMessageInfo>;

  constructor() {
    this.transporter = createTransport(this.options);
  };
}

export class SendEmailController {

  static sendEmail(transporter: Transporter<SMTPTransport.SentMessageInfo>): any {

    return async (req: any, res: any) => {

      if (req.body && req.body.email && req.otp) {

        await transporter.sendMail({
          from: process.env.SMTP_SEND_FROM,
          to: req.body.email,
          subject: 'Verify Email using code',
          text: `Please enter the following code into the verification field: ${req.otp}`,
        })
        .then((results: any) => {
          console.log('Message sent: %s', results.messageId);
          return res.send(results);
        })
        .catch((err: any) => {
          console.error(err);
          return res.status(500).send(err);
        })
      }
    }  
  }
}  
