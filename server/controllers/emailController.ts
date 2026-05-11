import { createTransport } from 'nodemailer';
import type { Transporter } from 'nodemailer';
import * as SMTPTransport from 'nodemailer/lib/smtp-transport';

export class Email {
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

  transporter: Transporter<SMTPTransport.SentMessageInfo> = createTransport(this.options);

  constructor() {};
}

export class EmailController {

  static async sendEmail(
    transporter: Transporter<SMTPTransport.SentMessageInfo>,
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    subject: string,
    message: string
  ): Promise<any> {
  
    await transporter.sendMail({
      from: process.env.SMTP_SEND_TO,
      to: process.env.SMTP_SEND_TO,
      subject: subject,
      text: 'Name: ' + firstName + ' ' + lastName + '\n\n' +
        'Email: ' + email + '\n\n' +
        'Phone: '  + phone + '\n\n' +
        'Message: ' + message,
    })
    .then((results: any) => {
      // console.log('Message sent: %s', results.messageId);
    })
    .catch((e: any) => {
      console.error(e)
    })
  }
}
