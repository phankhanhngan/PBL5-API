import * as express from 'express';
import accountController from '../controllers/account.controller';
import authController from '../controllers/auth.controller';

const accountRouter = express.Router();

accountRouter
  .route('/')
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    accountController.create
  )
  .get(
    authController.protect,
    authController.restrictTo('admin'),
    accountController.getAll,
    accountController.search
  );

accountRouter
  .route('/:id')
  .get(authController.protect, authController.isCurrent, accountController.get)
  .patch(
    authController.protect,
    authController.isCurrent,
    accountController.update
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    accountController.delete
  );

export default accountRouter;
