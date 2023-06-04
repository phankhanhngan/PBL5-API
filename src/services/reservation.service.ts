import reservation from '../models/reservation.model';
import { Document } from 'mongoose';
import parkingsite from '../models/parkingsite.model';
import * as mongoose from 'mongoose';

class reservationService {
  constructor() {}

  getAll = async () => {
    return reservation.find();
  };

  create = async (reservation: Document) => {
    return reservation.save();
  };

  getMyReservation = async (id: string) => {
    return reservation.find({ account: id });
  };

  get = async (id: string) => {
    return reservation.findById(id);
  };

  getByLpPs = async (lpNumber: string, parkingSiteId: string) => {
    return reservation
      .find({ lpNumber: lpNumber, parkingSite: parkingSiteId })
      .sort({ reservingTime: -1 })
      .limit(1);
  };

  update = async (id: string) => {
    return reservation.findByIdAndUpdate(id, { enteringTime: new Date() });
  };

  search = async (reqQuery, account = null) => {
    let pipe: any = [
      {
        $lookup: {
          from: 'accounts',
          localField: 'account',
          foreignField: '_id',
          as: 'account'
        }
      },
      {
        $lookup: {
          from: 'parkingsites',
          localField: 'parkingSite',
          foreignField: '_id',
          as: 'parkingSite'
        }
      },
      {
        $match: {
          $and: [
            {
              $or: [
                {
                  'account.name': {
                    $regex: `${reqQuery.keyword}`,
                    $options: 'i'
                  }
                },
                {
                  lpNumber: {
                    $regex: `${reqQuery.keyword}`,
                    $options: 'i'
                  }
                },
                {
                  'account.username': {
                    $regex: `${reqQuery.keyword}`,
                    $options: 'i'
                  }
                },
                {
                  'account.phone': {
                    $regex: `${reqQuery.keyword}`,
                    $options: 'i'
                  }
                },
                {
                  'parkingSite.name': {
                    $regex: `${reqQuery.keyword}`,
                    $options: 'i'
                  }
                },
                {
                  'parkingSite.location.address': {
                    $regex: `${reqQuery.keyword}`,
                    $options: 'i'
                  }
                }
              ]
            }
          ]
        }
      }
    ];
    if (account !== null)
      pipe.push({
        $match: {
          'account._id': new mongoose.Types.ObjectId(account)
        }
      });
    return reservation.aggregate(pipe);
  };
}

export default reservationService;
