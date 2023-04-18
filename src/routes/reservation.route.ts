import * as express from 'express';
import authController from '../controllers/auth.controller';
import reservationController from '../controllers/reservation.controller';
import parkingsiteController from '../controllers/parkingsite.controller';

const reservationRouter = express.Router();

reservationRouter
  .route('/')
  .get(
    authController.protect,
    authController.restrictTo('admin'),
    reservationController.getAll
  )
  .post(
    authController.protect,
    authController.restrictTo('user'),
    reservationController.create
  );

reservationRouter
  .route('/:id')
  .get(authController.protect, reservationController.get);

reservationRouter
  .route('/myreserve')
  .get(
    authController.protect,
    authController.restrictTo('user'),
    reservationController.getMyReservation
  );

reservationRouter
  .route('/checkin')
  .get(
    reservationController.checkin,
    reservationController.update,
    parkingsiteController.updateSpot
  );

export default reservationRouter;
