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
    return parkingsite.find().sort({ availableSpot: -1 });
  };

  update = async (id: string, parkingSite) => {
    const ps: any = await parkingsite.findById(id);
    if (parkingSite.name) ps.name = parkingSite.name;
    if (parkingSite.address) ps.address = parkingSite.address;
    if (parkingSite.maxSpot) ps.maxSpot = parkingSite.maxSpot;
    if (parkingSite.price) ps.price = parkingSite.price;
    if (parkingSite.description) ps.description = parkingSite.description;
    if (parkingSite.location.coordinates)
      ps.location.coordinates = parkingSite.location.coordinates;
    if (parkingSite.location.address)
      ps.location.address = parkingSite.location.address;
    return ps.save();
  };

  delete = (id: string) => {
    return parkingsite.findByIdAndDelete(id);
  };

  getNearby = (longitude, latitude, radius, reqQuery) => {
    const priceQuery = reqQuery.price
      ? new ComparisonOperator(reqQuery.price).format()
      : { $gt: 0 };
    const availSpotQuery = reqQuery.avail
      ? new ComparisonOperator(reqQuery.avail).format()
      : { $gt: 0 };

    return parkingsite.find({
      location: {
        $geoWithin: {
          $centerSphere: [[longitude, latitude], radius]
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

    return parkingsite.find({ ...searchQuery }).sort({ availableSpot: -1 });
  };

  updateSpot = (id: string) => {
    return parkingsite.findByIdAndUpdate(id, {
      $inc: { availableSpot: -1 }
    });
  };

  isAvailable = (id: string) => {
    return parkingsite.findById(id).where('availableSpot').gt(0);
  };
}

export default parkingsiteService;
