import { Document } from 'mongoose';
import Account from '../models/account.model';

class accountService {
  constructor() {}

  create = (account: Document) => {
    return account.save();
  };

  get = (id: string) => {
    return Account.findById(id);
  };

  getByUsername = (username: string) => {
    return Account.findOne({ username: username }).select('+password');
  };

  getAll = () => {
    return Account.find();
  };

  update = (id: string, account: Document) => {
    return Account.findByIdAndUpdate(id, account, { new: true });
  };

  updatePassword = (account, password) => {
    account.password = password;
    return account.save();
  };

  delete = (id: string) => {
    return Account.findByIdAndDelete(id);
  };

  search = (reqQuery) => {
    const searchQuery = {};

    if (reqQuery.keyword) {
      searchQuery['$or'] = [
        { $text: { $search: reqQuery.keyword } },
        {
          username: new RegExp(reqQuery.keyword, 'i')
        },
        {
          phone: new RegExp(reqQuery.keyword, 'i')
        }
      ];
    }

    if (reqQuery.type) {
      searchQuery['type'] = new RegExp(reqQuery.type, 'i');
    }

    return Account.find(searchQuery);
  };

  isDuplicatePhone = async (phone: string) => {
    return Account.exists({ phone: phone });
  };
}

export default accountService;
