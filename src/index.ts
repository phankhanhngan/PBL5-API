import * as express from 'express';
import { Express, Request, Response } from 'express';

import accountRouter from './routes/account.route';
import handleError from './utils/handleError';
import authRoute from './routes/auth.route';

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

app.use('/api/accounts', accountRouter);
app.use('/api/auth', authRoute);
// middleware handle errors
app.use(handleError);

app.get('/api/hi', (req: Request, res: Response) => {
  res.send('App is running in dev ...');
});

app.listen(5000, () => {
  console.log('App listening on port 5000...');
});
