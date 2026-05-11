// import { UsersController } from './usersController';
import type { Pool } from 'mysql2/promise';
import type { Transporter } from 'nodemailer';

export class EndpointsController {
  constructor(app: any, mySqlPool: Pool, transporter: Transporter<any>) {
    this.runEndpoints(app, mySqlPool, transporter)
  }

  runEndpoints(app: any, mySqlPool: Pool, transporter: Transporter<any>) {

  // Endpoints

  // Routes

  // 200 catch for /demo-menu
  /* app.get('/demo-menu', (req: any, res: any) => {
    res.status(200).sendFile('index.html', {root: path});
  });

  // 200 catch for /fibro-article
  app.get('/fibro-article', (req: any, res: any) => {
    res.status(200).sendFile('index.html', {root: path});
  });

  // 200 catch for /sample-page-one
  app.get('/sample-page-one', (req: any, res: any) => {
    res.status(200).sendFile('index.html', {root: path});
  });

  // 200 catch for /sample-page-two
  app.get('/sample-page-two', (req: any, res: any) => {
    res.status(200).sendFile('index.html', {root: path});
  });

  // 200 catch for /take-quiz
  app.get('/take-quiz', (req: any, res: any) => {
    res.status(200).sendFile('index.html', {root: path});
  });

  // 200 catch for /take-survey
  app.get('/take-survey', (req: any, res: any) => {
    res.status(200).sendFile('index.html', {root: path});
  });

  // 200 catch for /admin
  app.get('/admin', (req: any, res: any) => {
    res.status(200).sendFile('index.html', {root: path});
  });

  // 200 catch for /admin/create-modify-quiz-template
  app.get('/admin/create-modify-quiz-template', (req: any, res: any) => {
    res.status(200).sendFile('index.html', {root: path});
  });

  // 200 catch for /admin/create-modify-survey-template
  app.get('/admin/create-modify-survey-template', (req: any, res: any) => {
    res.status(200).sendFile('index.html', {root: path});
  });

  // 200 catch for /admin/activate-quiz-survey-template
  app.get('/admin/activate-quiz-survey-template', (req: any, res: any) => {
    res.status(200).sendFile('index.html', {root: path});
  });

  // Redirect for /wiki
  app.get('/wiki/{*splat}', (req, res) => {
    if (req.originalUrl) {
      res.redirect('https://en.wikipedia.org' + req.originalUrl);
    }
  });

  // 404 catch
  app.all('/{*splat}', (req: any, res: any) => {
    res.status(404).send('Not Found');
  }); */
  } 
}
