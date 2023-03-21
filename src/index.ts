import * as express from 'express';
import { Express, Request, Response } from 'express';

import accountRouter from './routes/account.route';
import handleError from './utils/handleError';
import authRouter from './routes/auth.route';
import parkingsiteRouter from './routes/parkingsite.route';
import * as morgan from 'morgan';

const app: Express = express();

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
// middleware handle errors
app.use(handleError);

app.get('/api/hi', (req: Request, res: Response) => {
  res.send('App is running in dev ...');
});

app.listen(5000, () => {
  console.log('App listening on port 5000...');
});
