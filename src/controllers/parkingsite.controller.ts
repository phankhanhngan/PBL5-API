import parkingsiteService from '../services/parkingsite.service';
import { Request, Response, NextFunction } from 'express';
import ParkingsiteModel from '../models/parkingsite.model';
import AppError from '../utils/appError';

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
    // Resolve conflict route params
    if (req.params.id === 'nearby') return next();

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
    // if users want to search parking sites, go to the next middleware
    if (Object.keys(req.query).length !== 0) return next();

    try {
      await this.parkingsiteService.getAll().then((result) => {
        res.status(200).json({
          status: 'success',
          data: {
            result: result.length,
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

  getNearby = async (req: Request, res: Response, next: NextFunction) => {
    const { distance, lat, lng } = req.query;
    if (!lat || !lng) {
      next(
        new AppError(
          'Please provide latitude and longitude in the format lat,lng.',
          400
        )
      );
    }
    // Distance will be distance or 10 km
    // Convert distance to radius
    let radius = 10 / 6378.1;
    if (typeof distance === 'string') {
      radius = parseFloat(distance) / 6378.1;
    }

    try {
      await this.parkingsiteService
        .getNearby(lat, lng, radius, req.query)
        .then((result) => {
          res.status(200).json({
            status: 'success',
            data: {
              result: result.length,
              parkingsite: result
            }
          });
        });
      next();
    } catch (err) {
      next(err);
    }
  };

  search = async (req: Request, res: Response, next: NextFunction) => {
    // If users simply want to get all parkingsite without searching
    if (Object.keys(req.query).length === 0) return next();

    try {
      await this.parkingsiteService.search(req.query).then((result) => {
        res.status(200).json({
          status: 'success',
          data: {
            result: result.length,
            parkingsite: result
          }
        });
      });
      next();
    } catch (err) {
      next(err);
    }
  };
}

export default new parkingsiteController(new parkingsiteService());
