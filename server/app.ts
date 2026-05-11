import "react-router";
import { createRequestHandler } from "@react-router/express";
import express from "express";
import mysql from 'mysql2/promise';
import type { Pool } from 'mysql2/promise';
import type { Transporter } from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

import { EndpointsController } from './controllers/endpointsController';
import { Email } from './controllers/emailController';

declare module "react-router" {
  interface AppLoadContext {
    VALUE_FROM_EXPRESS: string;
  }
}

export const app = express();

// Create the connection to database
const mySqlPool = await mysql.createPool({
  host: process.env.MYSQLHOST,
  port: Number(process.env.MYSQLPORT),
  database: process.env.MYSQLDATABASE,
  user: process.env.MYSQLUSER,
  password: process.env.PASSWORD
});

const connection = await mySqlPool.getConnection();

// Create new Nodemailer transporter object
const transporter: Transporter<SMTPTransport.SentMessageInfo> = new Email().transporter;

// Endpoints
new EndpointsController(app, mySqlPool, transporter);

app.use(
  createRequestHandler({
    build: () => import("virtual:react-router/server-build"),
    getLoadContext() {
      return {
        VALUE_FROM_EXPRESS: "Hello from Express",
      };
    },
  }),
);

connection.release();
await mySqlPool.end();
