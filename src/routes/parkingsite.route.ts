import * as express from 'express';
import parkingsiteController from '../controllers/parkingsite.controller';
import authController from '../controllers/auth.controller';

const parkingSiteRouter = express.Router();

parkingSiteRouter
  .route('/')
  .get(parkingsiteController.getAll, parkingsiteController.search)
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    parkingsiteController.create
  );

parkingSiteRouter
  .route('/:id')
  .get(parkingsiteController.get)
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    parkingsiteController.update
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    parkingsiteController.delete
  );

// /api/parkingsites/search?distance=&price=&availableSpot=
parkingSiteRouter.route('/nearby').get(parkingsiteController.getNearby);

export default parkingSiteRouter;
