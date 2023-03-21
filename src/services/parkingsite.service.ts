import { Document } from 'mongoose';
import parkingsite, { IParkingSite } from '../models/parkingsite.model';

class parkingsiteService {
  constructor() {}

  create = (parkingSite: Document) => {
    return parkingSite.save();
  };

  get = (id: string) => {
    return parkingsite.findById(id);
  };

  getAll = () => {
    return parkingsite.find();
  };

  update = (id: string, parkingSite: Document) => {
    return parkingsite.findByIdAndUpdate(id, parkingSite, { new: true });
  };

  delete = (id: string) => {
    return parkingsite.findByIdAndDelete(id);
  };
}

export default parkingsiteService;
