import { UpdateQuery } from 'mongoose';
import Account from '../models/account.model';

class accountService {
  constructor() {}

  createAccount = (account) => {
    return account.save();
  };

  getAccount = (id: string) => {
    return Account.findById(id);
  };

  getAccountByUsername = (username: string) => {
    return Account.findOne({ username: username }).select('+password');
  };

  getAllAccounts = () => {
    return Account.find();
  };

  updateAccount = (id: string, account) => {
    return Account.findByIdAndUpdate(id, account);
  };

  deleteAccount = (id: string) => {
    return Account.findByIdAndDelete(id);
  };
}

export default new accountService();
