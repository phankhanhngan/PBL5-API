import * as express from 'express';
import { Express, NextFunction, Request, Response } from 'express';

import accountRouter from './routes/account.route';
import handleError from './utils/handleError';
import authRouter from './routes/auth.route';
import parkingsiteRouter from './routes/parkingsite.route';
import reservationRouter from './routes/reservation.route';
import * as morgan from 'morgan';
import * as cors from 'cors';

const app: Express = express();

// config cors
app.use(
  cors({
    credentials: true,
    origin: '*'
  })
);

app.use(function (req: Request, res: Response, next: NextFunction) {
  res.header('Access-Control-Allow-Origin', '127.0.0.1:3000'); // update to match the domain you will make the request from
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});
// config env
require('dotenv').config({ path: './config.env' });

// config mongoose
const mongoose = require('mongoose');
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true
  })
  .then(() => {
    console.log('DB connection successful');
  });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('tiny'));

app.use('/api/accounts', accountRouter);
app.use('/api/auth', authRouter);
app.use('/api/parkingsites', parkingsiteRouter);
app.use('/api/reservation', reservationRouter);
// middleware handle errors
app.use(handleError);

app.listen(5000, () => {
  console.log('App listening on port 5000...');
});
