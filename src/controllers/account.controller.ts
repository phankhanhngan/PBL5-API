import { NextFunction, Request, Response } from 'express';
import Account from '../models/account.model';
import accountService from '../services/account.service';

class accountController {
  constructor() {}

  createAccount = async (req: Request, res: Response, next: NextFunction) => {
    const { username, password, type, name, phone } = req.body;
    const account = new Account({
      username,
      password,
      type,
      name,
      phone
    });
    try {
      await accountService.createAccount(account).then((result) => {
        res.status(200).json({
          status: 'success',
          data: {
            account: result
          }
        });
      });
    } catch (err) {
      next(err);
    }
    next();
  };

  getAccount = async (req: Request, res: Response, next: NextFunction) => {
    const id: string = req.params.id;
    try {
      await accountService.getAccount(id).then((result) => {
        res.status(200).json({
          status: 'success',
          data: {
            account: result
          }
        });
      });
    } catch (err) {
      next(err);
    }
    next();
  };

  getAllAccounts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await accountService.getAllAccounts().then((result) => {
        res.status(200).json({
          status: 'success',
          data: {
            accounts: result
          }
        });
      });
    } catch (err) {
      next(err);
    }
    next();
  };

  updateAccount = (req: Request, res: Response, next: NextFunction) => {
    const id: string = req.params.id;
    const update = req.body;
    if (update.password) {
      const err = { statusCode: 400, message: 'You cannot update password' };
      return next(err);
    }
    try {
      accountService.updateAccount(id, update).then((result) => {
        res.status(200).json({
          status: 'success',
          data: {
            account: result
          }
        });
      });
    } catch (err) {
      next(err);
    }
    next();
  };

  deleteAccount = async (req: Request, res: Response, next: NextFunction) => {
    const id: string = req.params.id;
    try {
      await accountService.deleteAccount(id).then((result) => {
        res.status(200).json({
          status: 'success',
          data: {
            account: result
          }
        });
      });
    } catch (err) {
      next(err);
    }
    next();
  };
}

export default new accountController();
