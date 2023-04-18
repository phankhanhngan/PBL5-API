import * as express from 'express';
import { Express, NextFunction, Request, Response } from 'express';

import accountRouter from './routes/account.route';
import handleError from './utils/handleError';
import authRouter from './routes/auth.route';
import parkingsiteRouter from './routes/parkingsite.route';
import reservationRouter from './routes/reservation.route';
import * as morgan from 'morgan';
import * as cors from 'cors';

import * as jwt from 'jsonwebtoken';

const app: Express = express();

// config cors
app.use(
  cors({
    credentials: true,
    origin: '*'
  })
);

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
app.post('/decode', function (req: Request, res: Response, next: NextFunction) {
  const { token } = req.query;
  console.log(token);
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  res.status(200).json({
    status: 'success',
    data: {
      decoded
    }
  });
  next();
});
// middleware handle errors
app.use(handleError);

app.listen(5000, () => {
  console.log('App listening on port 5000...');
});
