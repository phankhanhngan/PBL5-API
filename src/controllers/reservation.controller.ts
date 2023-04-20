import reservationService from '../services/reservation.service';
import { Request, Response, NextFunction } from 'express';
import ReservationModel from '../models/reservation.model';
import AppError from '../utils/appError';

class reservationController {
  private reservationService: reservationService;
  constructor(reservationService) {
    this.reservationService = reservationService;
  }

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.reservationService.getAll().then((result) => {
        res.status(200).json({
          status: 'success',
          data: {
            result: result.length,
            data: result
          }
        });
      });
    } catch (err) {
      next(err);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    const { parkingSite, lpNumber } = req.body;
    const reservation = new ReservationModel({
      account: res.locals.account,
      parkingSite,
      reservingTime: new Date(),
      lpNumber
    });
    try {
      await this.reservationService.create(reservation).then((result) => {
        res.status(200).json({
          status: 'success',
          data: {
            reservation: result
          }
        });
      });
    } catch (err) {
      next(err);
    }
    next();
  };

  getMyReservation = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const id = res.locals.account._id;
    try {
      await this.reservationService.getMyReservation(id).then((result) => {
        res.status(200).json({
          status: 'success',
          data: {
            result: result.length,
            reservation: result
          }
        });
      });
    } catch (err) {
      next(err);
    }
    next();
  };

  get = async (req: Request, res: Response, next: NextFunction) => {
    if (req.params.id === 'myreserve' || req.params.id === 'checkin')
      return next();

    const { id } = req.params;
    const reservation: any = await this.reservationService.get(id);
    if (reservation !== null) {
      if (
        res.locals.account._id.equals(reservation.account._id) ||
        res.locals.account.type === 'admin'
      ) {
        res.status(200).json({
          status: 'success',
          data: {
            reservation
          }
        });
        return next();
      }
    }
    res.status(400).json({
      status: 'fail',
      message: 'There is no reservation found with that id!'
    });
    next();
  };

  checkin = async (req: Request, res: Response, next: NextFunction) => {
    const { lpNumber } = req.query;
    const reservation = await this.reservationService.getByLp(
      lpNumber.toString()
    );
    if (reservation[0] !== undefined) {
      if (
        new Date().getTime() - reservation[0].reservingTime.getTime() >
          3600000 ||
        reservation[0].enteringTime !== undefined
      ) {
        return next(
          new AppError(
            'You have been checked in before or your registration has expired!'
          )
        );
      } else {
        res.status(200).json({
          status: 'success',
          data: {
            reservation
          }
        });
        res.locals.reservation = reservation[0]._id;
        res.locals.parkingSite = reservation[0].parkingSite;
        return next();
      }
    } else {
      console.log('else');
      return next(
        new AppError('There is no reservation found with that lp number!')
      );
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.reservationService.update(res.locals.reservation);
      next();
    } catch (err) {
      console.log('err in update reservation');
      return next(err);
    }
  };
}

export default new reservationController(new reservationService());
