import { NextFunction, Request, Response } from 'express';
import accountService from '../services/account.service';
import AccountModel from '../models/account.model';
import AppError from '../utils/appError';
import AccountService from '../services/account.service';
import authController from './auth.controller';

class accountController {
  private accountService: accountService;
  constructor(accountService: accountService) {
    this.accountService = accountService;
  }

  create = async (req: Request, res: Response, next: NextFunction) => {
    const { username, password, type, name, phone } = req.body;
    const account = new AccountModel({
      username,
      password,
      type,
      name,
      phone
    });
    try {
      await this.accountService.create(account).then((result) => {
        res.status(200).json({
          status: 'success',
          data: {
            account: result
          }
        });
      });
      next();
    } catch (err) {
      next(err);
    }
  };

  get = async (req: Request, res: Response, next: NextFunction) => {
    const id: string = req.params.id;
    try {
      await this.accountService.get(id).then((result) => {
        res.status(200).json({
          status: 'success',
          data: {
            account: result
          }
        });
      });
      next();
    } catch (err) {
      next(err);
    }
  };

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    if (Object.keys(req.query).length !== 0) return next();

    try {
      await this.accountService.getAll().then((result) => {
        res.status(200).json({
          status: 'success',
          data: {
            result: result.length,
            accounts: result
          }
        });
      });
      next();
    } catch (err) {
      next(err);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    const id: string = req.params.id;
    const update = req.body;
    if (update.password) {
      return next(
        new AppError('This route is not for updating password!', 400)
      );
    }
    if (update.username) {
      return next(new AppError('You cannot change your username!', 400));
    }
    try {
      await this.accountService.update(id, update).then((result) => {
        res.status(200).json({
          status: 'success',
          data: {
            account: result
          }
        });
      });
      next();
    } catch (err) {
      next(err);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    const id: string = req.params.id;
    try {
      await this.accountService.delete(id).then((result) => {
        res.status(200).json({
          status: 'success'
        });
      });
      next();
    } catch (err) {
      next(err);
    }
  };

  search = async (req: Request, res: Response, next: NextFunction) => {
    if (Object.keys(req.query).length === 0) return next();

    try {
      await this.accountService.search(req.query).then((result) => {
        res.status(200).json({
          status: 'success',
          data: {
            result: result.length,
            accounts: result
          }
        });
      });
      next();
    } catch (err) {
      next(err);
    }
  };

  changePassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const account = await this.accountService
        .get(res.locals.account._id)
        .select('+password');

      if (
        !(await account.correctPassword(
          req.body.currentPassword,
          account.password
        ))
      ) {
        return next(new AppError('Your current password is wrong.', 401));
      }

      await this.accountService
        .updatePassword(account, req.body.newPassword)
        .then((result) => {
          authController.createSignToken(req, res, result);
        });
    } catch (err) {
      next(err);
    }
  };
}

export default new accountController(new accountService());
