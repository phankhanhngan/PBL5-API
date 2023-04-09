import mongoose, { Model, Schema } from 'mongoose';

export interface IReservation {
  account: mongoose.ObjectId;
  parkingSite: mongoose.ObjectId;
  reservingTime: Date;
  enteringTime: Date;
  lpNumber: string;
}

export interface IReservationMethods {
  payment(): ReservationModel;
}

type ReservationModel = Model<IReservation, {}, IReservationMethods>;

const ReservationSchema: Schema = new Schema<
  IReservation,
  ReservationModel,
  IReservationMethods
>({
  account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account'
  },
  parkingSite: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ParkingSite'
  },
  reservingTime: Date,
  enteringTime: Date,
  lpNumber: {
    type: String,
    required: true
  }
});

export default mongoose.model<IReservation, ReservationModel>(
  'Reservation',
  ReservationSchema
);
