import * as express from 'express';
import accountController from '../controllers/account.controller';
import authController from '../controllers/auth.controller';

const accountRouter = express.Router();

accountRouter
  .route('/')
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    accountController.createAccount
  )
  .get(
    authController.protect,
    authController.restrictTo('admin'),
    accountController.getAllAccounts
  );

accountRouter
  .route('/:id')
  .get(
    authController.protect,
    authController.isCurrent,
    accountController.getAccount
  )
  .patch(
    authController.protect,
    authController.isCurrent,
    accountController.updateAccount
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    accountController.deleteAccount
  );

export default accountRouter;
