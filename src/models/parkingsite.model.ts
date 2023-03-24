import mongoose, { Model, Schema } from 'mongoose';
import slugify from 'slugify';

export interface IParkingSite {
  name: string;
  slug?: string;
  maxSpot: number;
  availableSpot?: number;
  price: number;
  description: string;
  location: object;
}

export interface IParkingSiteMethods {
  nearestSite(): ParkingSiteModel;
}

type ParkingSiteModel = Model<IParkingSite, {}, IParkingSiteMethods>;

const ParkingSiteSchema: Schema = new Schema<
  IParkingSite,
  ParkingSiteModel,
  IParkingSiteMethods
>({
  name: { type: String, unique: true, required: true },
  slug: { type: String },
  maxSpot: { type: Number, required: true },
  availableSpot: { type: Number },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  location: {
    type: {
      type: String,
      default: 'Point',
      enum: ['Point']
    },
    coordinates: [Number],
    address: String
  }
});

ParkingSiteSchema.pre<IParkingSite>('save', function (next) {
  this.slug = slugify(this.name, {
    replacement: '-',
    lower: true
  });
  this.availableSpot = this.maxSpot;
  next();
});

ParkingSiteSchema.pre<IParkingSite>('update', function (next) {
  this.slug = slugify(this.name, {
    replacement: '-',
    lower: true
  });
  next();
});

export default mongoose.model<IParkingSite, ParkingSiteModel>(
  'ParkingSite',
  ParkingSiteSchema
);
