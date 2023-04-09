import reservation from '../models/reservation.model';
import { Document } from 'mongoose';

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

  getByLp = async (lpNumber: string) => {
    return reservation
      .find({ lpNumber: lpNumber })
      .sort({ reservingTime: -1 })
      .limit(1);
  };

  update = async (id: string) => {
    return reservation.findByIdAndUpdate(id, { enteringTime: new Date() });
  };
}

export default reservationService;
