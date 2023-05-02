import * as express from 'express';
import accountController from '../controllers/account.controller';
import authController from '../controllers/auth.controller';

const accountRouter = express.Router();

accountRouter
  .route('/check-phone/:phone')
  .get(accountController.isDuplicatePhone);

accountRouter.use(authController.protect);

accountRouter
  .route('/')
  .post(authController.restrictTo('admin'), accountController.create)
  .get(
    authController.restrictTo('admin'),
    accountController.getAll,
    accountController.search
  );

accountRouter
  .route('/:id/change-password')
  .patch(authController.isCurrent, accountController.changePassword);

accountRouter
  .route('/:id')
  .get(authController.isCurrent, accountController.get)
  .patch(authController.isCurrent, accountController.update)
  .delete(authController.restrictTo('admin'), accountController.delete);

export default accountRouter;
