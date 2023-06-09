import mongoose, { Model, Schema, Document } from 'mongoose';
import slugify from 'slugify';

export interface IParkingSite extends Document {
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
  if (!this.availableSpot || this.isModified('maxSpot'))
    this.availableSpot = this.maxSpot;
  next();
});

export default mongoose.model<IParkingSite, ParkingSiteModel>(
  'ParkingSite',
  ParkingSiteSchema
);
