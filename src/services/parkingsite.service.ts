import { Document } from 'mongoose';
import parkingsite, { IParkingSite } from '../models/parkingsite.model';
import ComparisonOperator from '../utils/handleComparisonOperator';

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

  getNearby = (latitude, longitude, radius, reqQuery) => {
    const priceQuery = reqQuery.price
      ? new ComparisonOperator(reqQuery.price).format()
      : { $gt: 0 };
    const availSpotQuery = reqQuery.avail
      ? new ComparisonOperator(reqQuery.avail).format()
      : { $gt: 0 };

    return parkingsite.find({
      location: {
        $geoWithin: {
          $centerSphere: [[latitude, longitude], radius]
        }
      },
      price: { ...priceQuery },
      availableSpot: { ...availSpotQuery }
    });
  };

  search = (reqQuery) => {
    const searchQuery = {};

    searchQuery['price'] = reqQuery.price
      ? new ComparisonOperator(reqQuery.price).format()
      : null;

    searchQuery['availableSpot'] = reqQuery.avail
      ? new ComparisonOperator(reqQuery.avail).format()
      : null;

    searchQuery['$text'] = reqQuery.keyword
      ? { $search: `"${reqQuery.keyword}"` }
      : null;

    Object.keys(searchQuery).forEach((key) => {
      if (searchQuery[key] === null) delete searchQuery[key];
    });
    console.log(searchQuery);
    return parkingsite.find({ ...searchQuery });
  };
}

export default parkingsiteService;
