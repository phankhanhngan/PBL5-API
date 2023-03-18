import mongoose, { Model, Document, Schema } from 'mongoose';
import * as bcrypt from 'bcryptjs';

export interface IAccount {
  username: string;
  password: string;
  isActive?: boolean;
  type?: string;
  name: string;
  phone: string;
}

export interface IAccountMethods {
  correctPassword(candidatePassword: string, password: string): Boolean;
}

type AccountModel = Model<IAccount, {}, IAccountMethods>;

const AccountSchema: Schema = new Schema<
  IAccount,
  AccountModel,
  IAccountMethods
>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  isActive: { type: Boolean, default: true },
  type: { type: String, default: 'user' },
  name: { type: String, required: true },
  phone: {
    type: String,
    required: true,
    minLength: 10,
    maxLength: 10,
    unique: true
  }
});

AccountSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);

  // Replace the password with the hash
  this.password = await bcrypt.hashSync(this.password, salt);
  return next();
});

AccountSchema.method(
  'correctPassword',
  async function (candidatePassword: string, password: string) {
    return await bcrypt.compare(candidatePassword, password);
  }
);

export default mongoose.model<IAccount, AccountModel>('Account', AccountSchema);
