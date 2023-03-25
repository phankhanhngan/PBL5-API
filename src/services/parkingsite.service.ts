import { Document } from 'mongoose';
import parkingsite from '../models/parkingsite.model';
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

    if (reqQuery.price) {
      searchQuery['price'] = new ComparisonOperator(reqQuery.price).format();
    }

    if (reqQuery.avail) {
      searchQuery['availableSpot'] = new ComparisonOperator(
        reqQuery.avail
      ).format();
    }

    //Must have "" around the keyword to search for exact match
    //If not, it will split the keyword into words and search for fields match each word
    if (reqQuery.keyword) {
      searchQuery['$text'] = { $search: `"${reqQuery.keyword}"` };
    }

    return parkingsite.find({ ...searchQuery });
  };
}

export default parkingsiteService;
