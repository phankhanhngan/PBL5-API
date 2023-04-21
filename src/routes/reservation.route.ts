import * as express from 'express';
import authController from '../controllers/auth.controller';
import reservationController from '../controllers/reservation.controller';
import parkingsiteController from '../controllers/parkingsite.controller';

const reservationRouter = express.Router();

reservationRouter
  .route('/checkin')
  .get(
    reservationController.checkin,
    reservationController.update,
    parkingsiteController.updateSpot
  );

reservationRouter.use(authController.protect);

reservationRouter
  .route('/')
  .get(authController.restrictTo('admin'), reservationController.getAll)
  .post(
    // authController.restrictTo('user'),
    parkingsiteController.isAvailable,
    reservationController.create
  );

reservationRouter.route('/:id').get(reservationController.get);

reservationRouter
  .route('/myreserve')
  .get(
    authController.restrictTo('user'),
    reservationController.getMyReservation
  );

export default reservationRouter;
