import { Request, Response, NextFunction } from 'express';
import AppError from '../utils/appError';
import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import Account from '../models/account.model';
import accountService from '../services/account.service';
import { promisify } from 'util';
import AccountService from '../services/account.service';
dotenv.config({ path: './config.env' });

class authController {
  private accountService;
  constructor(accountService: accountService) {
    this.accountService = accountService;
  }

  createSignToken = (req: Request, res: Response, doc) => {
    const token = jwt.sign({ data: doc._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN
    });
    res.cookie('jwt', token, {
      expires: new Date(
        Date.now() + parseInt(process.env.JWT_EXPIRES_IN) * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
      secure: req.secure || req.headers['x-forwarded-proto'] === 'https'
    });
    doc.password = undefined;
    res.status(200).json({
      status: 'success',
      data: {
        token,
        account: doc
      }
    });
  };

  signup = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { username, password, name, phone } = req.body;
      const account = new Account({
        username,
        password,
        name,
        phone
      });
      await this.accountService
        .create(account)
        .then((result) => {
          this.createSignToken(req, res, result);
        })
        .catch((err) => next(new AppError(err.message)));
    } catch (err) {
      next(err);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { username, password } = req.body;
      if (!username || !password)
        return next(
          new AppError('Please input username and password to login', 400)
        );

      const account = await this.accountService.getByUsername(username);

      if (
        !account ||
        !(await account.correctPassword(password, account.password))
      )
        return next(new AppError('Incorrect username or password!', 401));
      this.createSignToken(req, res, account);
    } catch (err) {
      next(err);
    }
  };

  protect = async (req: Request, res: Response, next: NextFunction) => {
    try {
      let token: string = null;
      if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
      ) {
        token = req.headers.authorization.split(' ')[1];
      } else if (req.cookies) {
        if (req.cookies.jwt && req.cookies.jwt !== 'loggedout')
          token = req.cookies.jwt;
      }

      if (token === null) return next(new AppError('Please log in!', 400));

      const decoded = await promisify(jwt.verify)(
        token,
        process.env.JWT_SECRET
      ).catch((err) => next(new AppError(err.message)));

      if (decoded === undefined)
        return next(new AppError('Invalid token!', 400));
      //check if account still exists
      let account = await this.accountService.get(decoded.data);

      if (!account)
        return next(
          new AppError('This token does not belong to this user anymore!')
        );

      res.locals.account = account;
      next();
    } catch (err) {
      next(err);
    }
  };

  restrictTo = (...roles) => {
    return (req: Request, res: Response, next: NextFunction) => {
      if (!roles.includes(res.locals.account.type))
        return next(
          new AppError('You do not have permissions to access this route!', 400)
        );
      next();
    };
  };

  isCurrent = async (req: Request, res: Response, next: NextFunction) => {
    const id: string = req.params.id;
    if (res.locals.account.id === id || res.locals.account.type === 'admin')
      next();
    else
      return next(
        new AppError('You do not have permissions to access this route!', 400)
      );
  };

  logout = async (req: Request, res: Response, next: NextFunction) => {
    res.cookie('jwt', 'loggedout', {
      expires: new Date(Date.now() + 10 + 1000),
      httpOnly: true
    });
    res.status(200).json({
      status: 'success',
      message: 'Log out successfully!'
    });
    next();
  };
}

export default new authController(new AccountService());
