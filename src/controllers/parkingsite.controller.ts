import parkingsiteService from '../services/parkingsite.service';
import { Request, Response, NextFunction } from 'express';
import ParkingsiteModel from '../models/parkingsite.model';

class parkingsiteController {
  private parkingsiteService: parkingsiteService;
  constructor(parkingsiteService: parkingsiteService) {
    this.parkingsiteService = parkingsiteService;
  }

  create = async (req: Request, res: Response, next: NextFunction) => {
    const { name, maxSpot, price, description, lat, lgn, address } = req.body;
    const parkingsite = new ParkingsiteModel({
      name,
      maxSpot,
      price,
      description,
      location: {
        coordinates: [lat, lgn],
        address
      }
    });
    try {
      await this.parkingsiteService.create(parkingsite).then((result) => {
        res.status(200).json({
          status: 'success',
          data: {
            parkingsite: result
          }
        });
      });
    } catch (err) {
      next(err);
    }
    next();
  };

  get = async (req: Request, res: Response, next: NextFunction) => {
    const id: string = req.params.id;
    try {
      await this.parkingsiteService.get(id).then((result) => {
        res.status(200).json({
          status: 'success',
          data: {
            parkingsite: result
          }
        });
      });
      next();
    } catch (err) {
      next(err);
    }
  };

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.parkingsiteService.getAll().then((result) => {
        res.status(200).json({
          status: 'success',
          data: {
            parkingSite: result
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
    try {
      await this.parkingsiteService.update(id, update).then((result) => {
        res.status(200).json({
          status: 'success',
          data: {
            parkingSite: result
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
      await this.parkingsiteService.delete(id).then((result) => {
        res.status(200).json({
          status: 'success'
        });
      });
      next();
    } catch (err) {
      next(err);
    }
  };
}

export default new parkingsiteController(new parkingsiteService());
